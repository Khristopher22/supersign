import Image from "next/image";
import Img from '@/app/assets/desafio.png'

export default function Home() {
    return (
        <main className="flex items-center flex-col justify-center min-h-[calc(100vh-80px)]">
            <h1 className="font-bold text-3xl mb-2  ">Desafio Técnico</h1>
            <h2 className="font-medium text-2xl text-green-600   ">SuperSign</h2>
            <Image
                src={Img}
                alt="Imagem hero do SuperSign"
                width={600}
                className="max-w-sm md:max-w-xl"
            />
        </main>
    );
}
