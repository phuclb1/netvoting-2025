import { User } from "next-auth";
import { ComponentPropsWithRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props extends ComponentPropsWithRef<"span"> {
  user?: User;
}
/**
 * renders an user's avatar, and show a fallback initial of their name if no avatar is provided
 */
export function UserAvatar({ user, ...props }: Props) {
  const initials = user?.name
    // to chunks
    .split(" ")
    // initial of each name chunk
    .map((nameChunk) => nameChunk.charAt(0))
    .join("")
    // max 2 initials
    .slice(0, 2)
    .replace(/\W/g, "")
    .toUpperCase();

  // const { data: picture, isLoading } = useUserPicture(user?.ms_id ?? "", {
  //   staleTime: Infinity,
  // });
  const picture = "";

  return (
    <Avatar {...props}>
      <AvatarImage src={picture} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
