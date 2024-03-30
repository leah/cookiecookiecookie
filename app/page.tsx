'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

type Cookie = { id: number, imgSrc: string, left: number, top: number }

function acceptCookies(containerWidth: number, containerHeight: number) {
  let newCookies = [];
  let randomAmount = Math.ceil(Math.random() * 5) + 1; // between 2 and 6
  
  for (let i = 0; i < randomAmount; i++) {
    let num = Math.ceil(Math.random() * 10);
    let left = Math.ceil(Math.random() * containerWidth) - 100;
    let top = Math.ceil(Math.random() * containerHeight) - 100;
    newCookies.push({ id: i, imgSrc: `/cookies/${num}.png`, left: left, top: top })
  }

  return newCookies;
}

function Cookies() {
  var cookiesRendered = false;

  const [cookies, setCookies] = useState<Cookie[]>([]);
  const ref = useRef(null)

  useEffect(() => {
    if (cookiesRendered) return; // no idea why this is called twice!

    var newCookies = acceptCookies(ref.current.offsetWidth, ref.current.clientHeight);
    setCookies(newCookies);

    cookiesRendered = true;
  }, []);

  return (
    <div ref={ref} className="min-h-screen">
      {cookies.map(cookie => (
        <Image
          key={cookie.id}
          className="absolute"
          style={{left: cookie.left, top: cookie.top}}
          src={cookie.imgSrc}
          alt="Cookie"
          width={200}
          height={200}
          priority
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Cookies />
    </main>
  );
}
