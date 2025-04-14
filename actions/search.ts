"use server"

import { redirect } from "next/navigation";

export const searchAction = async(formData:FormData)=>{
    const searchText = formData.get("search") as string;
    if(typeof searchText !== 'string' || !searchText){
        redirect("/");
    }

    redirect(`/articles?search=${searchText}`);
}