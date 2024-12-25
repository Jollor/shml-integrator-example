import {  setValue } from "node-global-storage";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    return new Response(request.nextUrl.searchParams.get('challenge'), {
        status: 200,
    }); 
}

export async function POST(request: NextRequest) {
    const data = await request.json()
    setValue(Date.now().toString(), data)
    return NextResponse.json({ })
}