import logging from "@/lib/logging";
import { ReactNode } from "react";

export function PageHeader({children}: {children: ReactNode}){
  logging({rootPath:"admin/_components/PageHeader.tsx[5]",func:"PageHeader"})
  return <h1 className="text-4xl mb-4 mx-10 bg-blue-600 text-yellow-200">{children}</h1>
}
