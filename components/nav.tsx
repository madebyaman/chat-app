import Logout from '@/app/logout';
import Link from 'next/link';

const items = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Rooms',
    link: '/rooms',
  },
  {
    name: 'Profile',
    link: '/profile',
  },
];

export default function Navigation() {
  return (
    <nav className="flex sm:flex-row gap-4 items-center justify-center mt-6">
      {items.map((item) => (
        <Link
          href={item.link}
          key={item.name}
          className="inline-block rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          {item.name}
        </Link>
      ))}
      <Logout className="self-end text-sm py-2 px-3" />
    </nav>
  );
}
