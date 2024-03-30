'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

type Cookie = { id: number, imgSrc: string, left: number, top: number }

var cookieIndex = 0; // Unique IDs + keys please

function createCookies(containerWidth: number, containerHeight: number) {
  let newCookies: Cookie[] = [];
  let randomAmount = Math.ceil(Math.random() * 5) + 1; // between 2 and 6
  
  for (let i = 0; i < randomAmount; i++) {
    let num = Math.ceil(Math.random() * 10);
    let left = Math.ceil(Math.random() * containerWidth) - 100;
    let top = Math.ceil(Math.random() * containerHeight) - 100;

    let cookie = { id: cookieIndex, imgSrc: `/cookies/${num}.png`, left: left, top: top };
    newCookies.push(cookie);
    setCookie(null, `cookie-${cookieIndex}`, JSON.stringify(cookie), { maxAge: 30 * 24 * 60 * 60, path: '/'});

    cookieIndex++;
  }

  return newCookies;
}

function Cookies() {
  var cookiesRendered = false;

  const [cookies, setCookies] = useState<Cookie[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  function acceptCookies() {
    if (!ref.current) return;

    var newCookies = createCookies(ref.current.offsetWidth, ref.current.clientHeight);
    setCookies([...cookies, ...newCookies]);
  }

  function rejectCookies() {
    setCookies([]);

    const parsedCookies = parseCookies();
    Object.keys(parsedCookies).forEach(cookieName => {
      destroyCookie(null, cookieName, { path: '/' });
    })
  }

  useEffect(() => {
    if (cookiesRendered) return; // no idea why useEffect is called twice!

    let initialCookies: Cookie[] = [];
    const parsedCookies = parseCookies(); // get all stored cookies
    
    Object.values(parsedCookies).forEach(cookieData => {
      initialCookies.push(JSON.parse(cookieData));
    })

    initialCookies.sort((a, b) => a.id - b.id); // sort by index so they are layered as before
    
    setCookies(initialCookies);

    // update index to add new cookies with unique IDs
    let lastCookie = initialCookies.slice(-1)[0];
    if (lastCookie) cookieIndex = lastCookie.id + 1;

    cookiesRendered = true;
  }, []);

  function Popup() {
    return (
      <div className="fixed bottom-0 left-0 p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-4 space-y-2">
          <p>We use cookies to ensure you get the best experience on our website. If you continue to use
          this site we will assume that you like cookies. Everybody likes cookies.
          </p>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={acceptCookies}>
              Accept cookies
            </button>
          </div>
          <div>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={rejectCookies}>
              Reject cookies
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <Popup />
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
