import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'
import logging from "@/lib/logging";

export async function GET(
  req: NextRequest,
  { params: { id }}: { params: { id: string }}
){
  logging({rootPath:"admin/products/[id]/download]/route.ts[10]",func:"GET"})
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  })

  if (product == null) return notFound()

    const { size } = await fs.stat(`public${product.filePath}`)
    const file = await fs.readFile(`public${product.filePath}`)
    const extension = product.filePath.split(".").pop()

    return new NextResponse(file,
    { headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}`,
      "Content-Length": size.toString()
    },
  })
}