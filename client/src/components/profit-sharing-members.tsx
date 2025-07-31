import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, User, Plus, Trash2 } from "lucide-react";
import { validatePercentages } from "@/lib/profit-calculator";

interface Member {
  id: string;
  name: string;
  percentage: number;
}

interface ProfitSharingMembersProps {
  companyPercentage: number;
  members: Member[];
  onCompanyPercentageChange: (percentage: number) => void;
  onMemberChange: (id: string, field: keyof Member, value: string | number) => void;
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
}

export function ProfitSharingMembers({
  companyPercentage,
  members,
  onCompanyPercentageChange,
  onMemberChange,
  onAddMember,
  onRemoveMember
}: ProfitSharingMembersProps) {
  const validation = validatePercentages(companyPercentage, members);

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Step 5: Profit Sharing Members</h2>
          </div>
          <Button onClick={onAddMember} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        {/* Company Member (Special) */}
        <div className="border border-green-200 rounded-lg p-4 mb-4 bg-green-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Building className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Company (Special Member)</span>
              <span className="ml-2 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                Gets Tax & Frames Refund
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Profit Share Percentage
              </Label>
              <div className="relative">
                <Input
                  id="companyPercentage"
                  type="number"
                  placeholder="50"
                  min="0"
                  max="100"
                  step="0.1"
                  value={companyPercentage || ''}
                  onChange={(e) => onCompanyPercentageChange(parseFloat(e.target.value) || 0)}
                  className="pr-8 pl-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Members */}
        {members.map((member) => (
          <div key={member.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">{member.name || "New Member"}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`member-name-${member.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Member Name
                </Label>
                <Input
                  id={`member-name-${member.id}`}
                  type="text"
                  placeholder="Enter member name"
                  value={member.name}
                  onChange={(e) => onMemberChange(member.id, 'name', e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor={`member-percentage-${member.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Profit Share Percentage
                </Label>
                <div className="relative">
                  <Input
                    id={`member-percentage-${member.id}`}
                    type="number"
                    placeholder="25"
                    min="0"
                    max="100"
                    step="0.1"
                    value={member.percentage || ''}
                    onChange={(e) => onMemberChange(member.id, 'percentage', parseFloat(e.target.value) || 0)}
                    className="pr-8 pl-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Percentage Validation */}
        <div className={`border rounded-lg p-3 ${validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${validation.isValid ? 'text-green-900' : 'text-red-900'}`}>
              Total Percentage Allocated:
            </span>
            <span className={`text-lg font-semibold ${validation.isValid ? 'text-green-900' : 'text-red-900'}`}>
              {validation.total.toFixed(1)}%
            </span>
          </div>
          <div className={`mt-2 text-xs ${validation.isValid ? 'text-green-700' : 'text-red-700'}`}>
            {validation.isValid 
              ? "✓ Perfect! Total equals 100%" 
              : `${validation.total < 100 ? 'Total must equal 100%' : 'Total exceeds 100%'}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
