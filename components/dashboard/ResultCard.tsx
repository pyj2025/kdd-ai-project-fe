import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalcResult } from "./DecisionForm";

interface ResultCardProps {
  result: CalcResult;
  ticker: string;
}

export function ResultCard({ result, ticker }: ResultCardProps) {
  const borderColor =
    result.status_color === "red"
      ? "border-red-200"
      : result.status_color === "green"
        ? "border-green-200"
        : "border-gray-200";

  const amountColor =
    result.status_color === "red"
      ? "text-red-600"
      : result.status_color === "green"
        ? "text-green-600"
        : "text-gray-600";

  return (
    <Card className={`border-2 ${borderColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>{result.icon}</span>
          <span>{ticker} 결과</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{result.message}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">과거 가격</p>
            <p className="font-semibold">${result.past_price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">현재 가격</p>
            <p className="font-semibold">${result.current_price.toLocaleString()}</p>
          </div>
        </div>

        <div className={`text-center py-3 rounded-md bg-muted`}>
          <p className="text-xs text-muted-foreground mb-1">결과 차이</p>
          <p className={`text-2xl font-bold ${amountColor}`}>
            ${result.difference_amount.toLocaleString()}
          </p>
          <p className={`text-sm ${amountColor}`}>{result.difference_percent}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
