'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/storage';
export default function HomePage(){const router=useRouter();useEffect(()=>{const s=getSession();router.replace(s?.token?'/dashboard/portfolio':'/login');},[router]);return null;}
