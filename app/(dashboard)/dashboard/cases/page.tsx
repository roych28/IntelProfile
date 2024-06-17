import Link from 'next/link';
import Image from 'next/image';

const cases = [
  { id: 1, title: 'Case 1', description: 'This is a brief description of Case 1.', thumbnail: '/placeholder.svg' },
  { id: 2, title: 'Case 2', description: 'This is a brief description of Case 2.', thumbnail: '/placeholder.svg' },
  { id: 3, title: 'Case 3', description: 'This is a brief description of Case 3.', thumbnail: '/placeholder.svg' },
  { id: 4, title: 'Case 4', description: 'This is a brief description of Case 4.', thumbnail: '/placeholder.svg' },
  { id: 5, title: 'Case 5', description: 'This is a brief description of Case 5.', thumbnail: '/placeholder.svg' },
  { id: 6, title: 'Case 6', description: 'This is a brief description of Case 6.', thumbnail: '/placeholder.svg' },
];

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cases</h1>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            prefetch={false}
          >
            New Case
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href="#"
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              prefetch={false}
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={caseItem.thumbnail}
                  alt={`Thumbnail for ${caseItem.title}`}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{caseItem.title}</h2>
                <p className="text-gray-500 mb-4">{caseItem.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
