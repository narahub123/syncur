import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Faq } from "../types";

type Props = { faq: Faq };

const FaqAccordionItem = ({ faq }: Props) => {
  return (
    <AccordionItem value={faq.value}>
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>{faq.answer}</AccordionContent>
    </AccordionItem>
  );
};

export default FaqAccordionItem;
