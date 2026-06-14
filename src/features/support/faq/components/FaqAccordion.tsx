import { Accordion } from "@/shared/components/ui/accordion";
import { FAQS } from "../constants/faq-list";
import FaqAccordionItem from "./FaqAccordionItem";

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible>
      {FAQS.map((faq) => (
        <FaqAccordionItem key={faq.value} faq={faq} />
      ))}
    </Accordion>
  );
}
