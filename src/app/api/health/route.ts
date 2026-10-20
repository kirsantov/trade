import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Простая проверка здоровья приложения
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.CUSTOM_BUILD_ID || 'unknown',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}