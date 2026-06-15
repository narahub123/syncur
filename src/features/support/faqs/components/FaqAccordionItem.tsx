import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { FaqResponseDTO } from "../dtos";

type Props = { faq: FaqResponseDTO };

const FaqAccordionItem = ({ faq }: Props) => {
  return (
    <AccordionItem value={faq._id}>
      <AccordionTrigger className="hover:bg-accent cursor-pointer px-2">
        {faq.question}
      </AccordionTrigger>
      <AccordionContent className="p-2">{faq.answer}</AccordionContent>
    </AccordionItem>
  );
};

export default FaqAccordionItem;
