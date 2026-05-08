// Live AI pipeline: Claude generates 3 design briefs as JSON, then for
// each design × each room, Replicate renders a hero image. Falls back to
// the mock pipeline if either ANTHROPIC_API_KEY or REPLICATE_API_TOKEN is
// missing.

import Anthropic from '@anthropic-ai/sdk';
import Replicate from 'replicate';
import {SKUS} from '@/data/products';
import type {DesignBrief, PipelineRequest, GeneratedDesigns} from './types';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN;

export function liveAvailable(): boolean {
  return Boolean(ANTHROPIC_KEY && REPLICATE_KEY);
}

const SYSTEM_PROMPT = `You are Diwan's senior interior designer. Diwan is a Saudi Arabian fit-out platform that delivers turnkey homes within thirty days. You design for KSA homes — informed by Najdi, Hijazi, and contemporary Saudi sensibilities — never imported.

For every customer you produce THREE distinct, costed, photorealistic design concepts. Each concept must:
- Have a name (English) and an Arabic name (nameAr).
- Have a single-sentence tagline.
- Have a five-color palette as hex codes.
- Have 3-5 style adjectives.
- Cover EVERY room provided in the request, in the same order.
- For each room, provide: a 30-40 word description, 2-4 material keywords, and 3-5 SKU IDs from the catalog (the catalog is provided), and a vivid 25-40 word image prompt suitable for a photorealistic renderer.

Make the three concepts visibly different — vary the palette, the materials, the formality, and the regional voice. Use the customer's taste vector as the anchor and treat the inspirations as steering signal.

Respond ONLY with a JSON object matching this exact shape:
{
  "designs": [
    {
      "name": "string",
      "nameAr": "string",
      "tagline": "string",
      "paletteHex": ["#xxxxxx", ...],
      "styleAdjectives": ["string", ...],
      "rooms": [
        {
          "roomId": "string (matches input)",
          "description": "string",
          "materials": ["string", ...],
          "skuIds": ["string", ...],
          "imagePrompt": "string"
        }
      ]
    }
  ]
}`;

export async function generateLiveDesigns(
  req: PipelineRequest,
  onProgress?: (p: number) => void,
): Promise<GeneratedDesigns> {
  if (!liveAvailable()) throw new Error('Live pipeline unavailable: missing API keys');
  const start = Date.now();
  const anthropic = new Anthropic({apiKey: ANTHROPIC_KEY!});
  const replicate = new Replicate({auth: REPLICATE_KEY!});

  // 1) Ask Claude for three design briefs
  onProgress?.(5);
  const userMessage = buildUserMessage(req);
  const completion = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{role: 'user', content: userMessage}],
  });
  onProgress?.(20);

  const text = completion.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n');
  const json = extractJson(text);
  if (!json || !Array.isArray(json.designs)) {
    throw new Error('Claude returned malformed JSON');
  }

  // 2) For each design × room, kick off Flux renders in parallel batches
  const designs: DesignBrief[] = [];
  const totalRenders = json.designs.length * req.rooms.length;
  let rendersDone = 0;

  for (const d of json.designs) {
    const rooms = await Promise.all(
      (d.rooms ?? []).map(async (r: any) => {
        const meta = req.rooms.find((rr) => rr.id === r.roomId);
        const roomType = meta?.type ?? 'family-living';
        const roomLabel = meta?.label ?? r.roomId;
        const prompt = buildImagePrompt(r.imagePrompt ?? '', d, meta);
        let imageUrl: string | null = null;
        try {
          const output = await replicate.run('black-forest-labs/flux-schnell', {
            input: {prompt, num_outputs: 1, aspect_ratio: '4:3', output_format: 'webp', output_quality: 90},
          });
          imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
        } catch (e) {
          console.error('Replicate render failed', e);
          imageUrl = null;
        }
        rendersDone++;
        onProgress?.(20 + Math.round((rendersDone / totalRenders) * 75));
        return {
          roomId: r.roomId,
          roomType,
          roomLabel,
          description: r.description ?? '',
          materials: r.materials ?? [],
          skuIds: validateSkuIds(r.skuIds ?? []),
          imagePrompt: prompt,
          imageUrl,
        };
      }),
    );
    designs.push({
      name: d.name,
      nameAr: d.nameAr,
      tagline: d.tagline,
      paletteHex: d.paletteHex ?? [],
      styleAdjectives: d.styleAdjectives ?? [],
      rooms,
    });
  }

  onProgress?.(100);

  return {
    generatedAt: Date.now(),
    durationMs: Date.now() - start,
    source: 'live',
    designs,
  };
}

function buildUserMessage(req: PipelineRequest): string {
  const skuLines = SKUS.map((s) => `${s.id} | ${s.category} | rooms=${s.forRooms.join(',')} | tags=${s.styleTags.join(',') || '-'} | ${s.name}`).join('\n');
  const roomLines = req.rooms.map((r) => `- ${r.id}: ${r.type} (${r.label}), ${r.widthM}×${r.heightM}m`).join('\n');
  return [
    `Customer taste vector (each axis from -1 to 1):`,
    JSON.stringify(req.taste, null, 2),
    ``,
    `Budget: SAR ${req.budget.toLocaleString()}`,
    `Timeline: ${req.timelineWeeks} weeks`,
    `Color voice: ${req.colorVoice}`,
    `Must-haves: ${req.mustHaves.join(', ') || 'none'}`,
    `Inspirations: ${req.inspirations.boardIds.join(', ') || 'none'}`,
    ``,
    `Rooms:`,
    roomLines,
    ``,
    `SKU catalog (use these IDs ONLY in skuIds):`,
    skuLines,
    ``,
    `Generate 3 design concepts now. Output JSON only.`,
  ].join('\n');
}

function buildImagePrompt(roomPrompt: string, design: any, room: any): string {
  const palette = (design.paletteHex ?? []).slice(0, 3).join(', ');
  return [
    roomPrompt || `Photorealistic Saudi Arabian ${room?.type ?? ''} interior`,
    `Style: ${(design.styleAdjectives ?? []).join(', ')}.`,
    `Color palette: ${palette}.`,
    `Architectural photography, soft directional light, no text, no watermark, ultra-sharp, 35mm.`,
  ].join(' ');
}

function extractJson(text: string): {designs: any[]} | null {
  const trimmed = text.trim();
  // Strip ```json ``` fences if present
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const raw = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function validateSkuIds(ids: string[]): string[] {
  const valid = new Set(SKUS.map((s) => s.id));
  return ids.filter((id) => valid.has(id));
}
