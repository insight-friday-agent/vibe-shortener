import { GetServerSideProps } from "next";
import { getLink } from "@/lib/links";

export default function RedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = typeof params?.code === "string" ? params.code : undefined;
  if (!code) {
    return {
      notFound: true,
    };
  }
  const link = await getLink(code);
  if (!link) {
    return {
      notFound: true,
    };
  }
  return {
    redirect: {
      destination: link.target,
      permanent: false,
    },
  };
};
