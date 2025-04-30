import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

interface Params {
  name: string;
  link: string;
  Icon?: IconType;
  disabled?: boolean;
}

export default function NavItem({
  name,
  link,
  Icon,
  disabled = false,
}: Params) {
  const base =
    "items-center px-4 py-2 bg-[#323649] rounded-full hover:bg-[#26233d]";
  const disabledClasses = "pointer-events-none opacity-50 hover:bg-[#323649]";
  const classes = disabled ? `${base} ${disabledClasses}` : base;

  return (
    <div className={classes}>
      <Link href={link} className="flex flex-row space-x-3">
        {Icon && <Icon className="mt-[2px] size-5" />}
        <span className="font-light text-xl">{name}</span>
      </Link>
    </div>
  );
}
