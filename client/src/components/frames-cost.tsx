import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

interface FramesCostProps {
  value: number;
  onChange: (value: number) => void;
}

export function FramesCost({ value, onChange }: FramesCostProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <Image className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 4: Total Cost of Frames</h2>
        </div>
        <div>
          <Label htmlFor="framesCost" className="block text-sm font-medium text-gray-700 mb-2">
            Frames Cost
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
            <Input
              id="framesCost"
              type="number"
              placeholder="500.00"
              step="0.01"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="pl-8 pr-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
