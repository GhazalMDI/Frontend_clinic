interface Banner {
    description:string;
    image:string;
}

interface About{
    title:string;
    description:string
}


interface ApiResponse{
    data:{
        banners:Banner[];
        abouts:About[];
    }
  }
