import logging from "@/lib/logging";
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage(){
  logging({rootPath:"admin/products/new/page.tsx[6]",func:"NewProductPage"})
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm/>
    </>
  )
}
