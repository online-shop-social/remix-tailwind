import { PrismaClient } from "@prisma/client";
import { Form, Link, useLoaderData, useTransition } from "remix";

export async function loader() {
  const prisma = new PrismaClient();
  const allAlbums = await prisma.album.findMany();
  // console.log(allAlbums);
  await prisma.$disconnect();
  return allAlbums;
}

export async function action({ request }) {
  const form = await request.formData();
  const prisma = new PrismaClient();
  const allAlbums = await prisma.album.create({
    data: { name: form.get('name'), image: form.get('image') },
  });
  console.log(allAlbums);
  await prisma.$disconnect();
  return true;
}

export default function Index() {
  const albums = useLoaderData();
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
        <h1 className='text-2xl xs:text-3xl md:text-6xl font-bold'>
          Welcome to{' '}
          <a className='text-green-600'>
            Music Box
          </a>
        </h1>
        <Form method='post' className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name='name' placeholder="Name" size={30} />
          </div>
          <div className='mb-4'>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name='image' placeholder="Album Art" size={30} />
          </div>
          <button className='rounded-lg border-2 border-solid border-green-600 p-5 text-center text-green-600 mt-10' type="submit" disabled={busy}>
            {busy ? "creating..." : "creating New Album"}
          </button>
        </Form>
        <div className='mt-4 grid grid-cols-1 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4'>
          {albums.map((item: any) => (

            <div className='bg-gray-900 shadow-lg rounded p-3' key={item.id}>
              <div className='group relative'>
                <img className='w-full h-full md:w-72 block rounded' src={item.image} alt='not found' />
              </div>
              <div className='p-5'>
                <h3 className='text-green text-lg'>{item.name}</h3>
              </div>
              {/* <Link to={`/songs/${item.id}`}>
                <button>View Details</button>
              </Link> */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
