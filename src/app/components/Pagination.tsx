// src/app/components/Pagination.tsx

"use client";

import { Button, Flex, Icon } from "@chakra-ui/react";
import { Pagination } from "@ark-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const buttonHeight = "40px";
  const fontSize = "15px";
  const paddingX = "16px";
  const marginX = "3px";

  return (
    <Pagination.Root
      count={totalPages}
      pageSize={1}
      page={currentPage}
      onPageChange={(details) => onPageChange(details.page)}
    >
      <Flex
        alignItems="center"
        overflow="hidden"
        width={{ base: "90%", sm: "76%" }}
        mx="auto"
        wrap="wrap"
        justifyContent="center"
        rowGap="14px"
      >
        <Pagination.PrevTrigger asChild>
          <Button
            bg="white"
            color="black"
            _hover={{ bg: "gray.400" }}
            mx={marginX}
            height={buttonHeight}
            fontSize={fontSize}
            px={paddingX}
          >
            <Icon as={FaArrowLeft} />
          </Button>
        </Pagination.PrevTrigger>

        <Pagination.Context>
          {(pagination) =>
            pagination.pages.map((page, index) =>
              page.type === "page" ? (
                <Pagination.Item key={index} {...page} asChild>
                  <Button
                    bg={currentPage === page.value ? "gray.500" : "white"}
                    color={currentPage === page.value ? "white" : "black"}
                    _hover={{ bg: "gray.400" }}
                    mx={marginX}
                    height={buttonHeight}
                    fontSize={fontSize}
                    px={paddingX}
                  >
                    {page.value}
                  </Button>
                </Pagination.Item>
              ) : (
                <Pagination.Ellipsis key={index} index={index}>
                  &#8230;
                </Pagination.Ellipsis>
              )
            )
          }
        </Pagination.Context>

        <Pagination.NextTrigger asChild>
          <Button
            bg="white"
            color="black"
            _hover={{ bg: "gray.400" }}
            mx={marginX}
            height={buttonHeight}
            fontSize={fontSize}
            px={paddingX}
          >
            <Icon as={FaArrowRight} />
          </Button>
        </Pagination.NextTrigger>
      </Flex>
    </Pagination.Root>
  );
}
