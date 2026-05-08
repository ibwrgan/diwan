import {NextResponse} from 'next/server';
import {generateMockDesigns} from '@/lib/ai/mockDesigns';
import {generateLiveDesigns, liveAvailable} from '@/lib/ai/livePipeline';
import type {PipelineRequest} from '@/lib/ai/types';

export const runtime = 'nodejs';
export const maxDuration = 90;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: PipelineRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
  }
  if (!body?.rooms?.length) {
    return NextResponse.json({error: 'No rooms provided'}, {status: 400});
  }

  try {
    const url = new URL(req.url);
    const fast = url.searchParams.get('fast') === '1';
    const useLive = liveAvailable();
    const result = useLive ? await generateLiveDesigns(body) : await generateMockDesigns(body, undefined, fast);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('generate-designs error', err);
    return NextResponse.json({error: err?.message ?? 'pipeline error'}, {status: 500});
  }
}

// Tiny GET so the client can probe live-vs-mock mode before submitting.
export async function GET() {
  return NextResponse.json({live: liveAvailable()});
}
