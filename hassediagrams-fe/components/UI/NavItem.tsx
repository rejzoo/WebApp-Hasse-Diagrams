import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

interface Params {
  name: string;
  link: string;
  Icon?: IconType;
}

export default function NavItem({ name, link, Icon }: Params) {
  return (
    <div className="items-center px-4 py-2 bg-[#323649] rounded-full hover:bg-[#26233d]">
      <Link href={link} className="flex flex-row space-x-3">
        {Icon && <Icon className="mt-[2px] size-5" />}
        <span className="font-light text-xl">{name}</span>
      </Link>
    </div>
  );
}
