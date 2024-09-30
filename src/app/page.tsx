// src/app/page.tsx

import { Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import MoviesPanel from "./components/MoviesPanel";
import Footer from "./components/Footer";

export default function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10); // Parse la page depuis les params d'URL

  return (
    <Flex
      direction="column"
      alignItems="center"
      bg="gray.800"
      color="white"
      minHeight="100vh"
    >
      <Header />
      <MoviesPanel currentPage={currentPage} /> {/* Passer currentPage ici */}
      <Flex flexGrow={1} />
      <Footer />
    </Flex>
  );
}
