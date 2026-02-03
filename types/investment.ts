export interface InvestmentIdea {
  id: string;
  title: string;
  description: string;
  investment: string;
  annualReturn: string;
  pros: string[];
  cons: string[];
  category: string;
}

export interface InvestmentCategory {
  id: string;
  title: string;
  ideas: InvestmentIdea[];
}
