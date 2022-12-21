import type { NextRequest } from "next/server"
import { ImageResponse } from "@vercel/og"

export const config = {
  runtime: "edge",
}

const font = fetch(new URL("../../public/fraunces.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer()
)

function makeName(username: string) {
  const trimmedName = username.trim()
  const needsApostrophe = ["s", "x", "z", "ß"].includes(trimmedName.slice(-1))

  return needsApostrophe ? trimmedName + "'" : trimmedName + "s"
}

export default async function handler(req: NextRequest) {
  const fontData = await font

  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("name")

    return new ImageResponse(
      (
        <div
          style={{
            background: "#f1f5f9",
            color: "#334155",
            width: "100%",
            height: "100%",
            fontFamily: "'Fraunces'",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: 64,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://emojicdn.elk.sh/🎒" alt="" width="72" height="72" />
          <div style={{ fontSize: 80, display: "flex" }}>
            {username ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{makeName(username).slice(0, 100)}</span>
                <span>Diensttermine</span>
              </div>
            ) : (
              "miny"
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Fraunces",
            data: fontData,
            style: "normal",
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(e.message)
    return new Response("Failed to generate the image", {
      status: 500,
    })
  }
}
