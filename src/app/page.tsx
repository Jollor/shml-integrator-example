"use client"
import { headers } from "next/headers";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [chats, setChats] = useState(new Map<string, {url: string}>());

  const getData = async () =>
  {
    const res = await fetch('/api/messages');
    if (res.status == 200) {
        const json = await res.json()
        const newChats = structuredClone(chats)
        for(const key in json)
        {
          newChats.set(key, json[key]);
        }
        setChats(newChats)
    }
  }

  function popupwindow(url: string | URL | undefined, title: string | undefined, w: number, h:  number) {
    var y = window.outerHeight / 2 + window.screenY - (h / 2)
    var x = window.outerWidth / 2 + window.screenX - (w / 2)
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
  }

  useEffect(()=>{
      setInterval(() => {
        getData().then(()=>{
        });
      }, 2000);

  },[])

  return ( 

<div className="md:flex mt-20 justify-center">
    <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
      { [...chats].map(([key, value]) => (

        <li key={key}>
            <a href="#"  onClick={() => popupwindow(value.url,'SHML', 800, 500)} className="cursor-pointer inline-flex items-center px-4 py-3 text-white bg-blue-500 rounded-lg active w-full">
                Chat with {key}
            </a>
        </li>
      ))}
    </ul>
</div>


  );
}
