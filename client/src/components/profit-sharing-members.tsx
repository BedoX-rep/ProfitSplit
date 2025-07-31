import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Users, Plus, X, Building, Percent } from "lucide-react";
import { Member } from "@shared/schema";
import { nanoid } from "nanoid";

interface ProfitSharingMembersProps {
  members: Member[];
  onChange: (members: Member[]) => void;
  companyPercentage: number;
  onCompanyPercentageChange: (percentage: number) => void;
}

export function ProfitSharingMembers({ 
  members, 
  onChange, 
  companyPercentage, 
  onCompanyPercentageChange 
}: ProfitSharingMembersProps) {
  const [newMemberName, setNewMemberName] = useState("");

  const updateMember = (id: string, field: keyof Member, value: string | number) => {
    const updated = members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    onChange(updated);
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;
    
    const newMember: Member = {
      id: nanoid(),
      name: newMemberName.trim(),
      percentage: 0,
    };
    
    onChange([...members, newMember]);
    setNewMemberName("");
  };

  const removeMember = (id: string) => {
    onChange(members.filter(member => member.id !== id));
  };

  const totalMemberPercentage = members.reduce((sum, member) => sum + (member.percentage || 0), 0);
  const totalPercentage = companyPercentage + totalMemberPercentage;
  const remainingPercentage = Math.max(0, 100 - totalPercentage);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-success/10 p-3">
          <Users className="h-6 w-6 text-success" />
        </div>
        <div>
          <h2 className="text-display-sm font-bold text-foreground">Step 5: Profit Sharing</h2>
          <p className="text-body-sm text-muted-foreground">Set company and member profit percentages</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company Percentage */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-5 w-5 text-primary" />
            <Label className="text-body font-semibold text-foreground">Company Share</Label>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  data-testid="slider-company-percentage"
                  value={[companyPercentage]}
                  onValueChange={([value]) => onCompanyPercentageChange(value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="w-20">
                <div className="relative">
                  <Input
                    data-testid="input-company-percentage"
                    type="number"
                    value={companyPercentage}
                    onChange={(e) => onCompanyPercentageChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="input-field text-center pr-8"
                    min="0"
                    max="100"
                  />
                  <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <h3 className="text-body-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </h3>

          {members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-body-sm">No team members added yet</p>
              <p className="text-caption">Add team members to distribute profit shares</p>
            </div>
          )}

          {members.map((member) => (
            <div key={member.id} className="flex gap-3 items-end p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex-1">
                <Label className="text-caption text-muted-foreground mb-2 block">
                  Member Name
                </Label>
                <Input
                  data-testid={`input-member-name-${member.id}`}
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  placeholder="Enter member name"
                  className="input-field"
                />
              </div>
              <div className="w-24">
                <Label className="text-caption text-muted-foreground mb-2 block">
                  Share %
                </Label>
                <div className="relative">
                  <Input
                    data-testid={`input-member-percentage-${member.id}`}
                    type="number"
                    step="0.1"
                    value={member.percentage || ''}
                    onChange={(e) => updateMember(member.id, 'percentage', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-field text-center pr-8"
                    min="0"
                    max="100"
                  />
                  <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button
                data-testid={`button-remove-member-${member.id}`}
                variant="ghost"
                size="sm"
                onClick={() => removeMember(member.id)}
                className="btn-ghost h-12 w-12 p-0 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-3 items-end p-4 rounded-xl bg-success-muted/50 border border-success/20">
            <div className="flex-1">
              <Label className="text-caption text-muted-foreground mb-2 block">
                Add New Member
              </Label>
              <Input
                data-testid="input-new-member-name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
                onKeyPress={(e) => e.key === 'Enter' && addMember()}
                className="input-field"
              />
            </div>
            <Button
              data-testid="button-add-member"
              onClick={addMember}
              disabled={!newMemberName.trim()}
              className="btn-secondary h-12 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Percentage Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-muted-foreground">Company:</span>
              <span className="text-body font-semibold text-primary">{companyPercentage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-muted-foreground">Team Members:</span>
              <span className="text-body font-semibold text-secondary">{totalMemberPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-body font-semibold text-foreground">Total Allocated:</span>
              <span className={`text-body-lg font-bold ${totalPercentage === 100 ? 'text-success' : totalPercentage > 100 ? 'text-destructive' : 'text-warning'}`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            {remainingPercentage > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-caption text-muted-foreground">Remaining:</span>
                <span className="text-body-sm text-warning">{remainingPercentage.toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {totalPercentage > 100 && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-caption text-destructive font-medium">
                Total percentage exceeds 100%. Please adjust the shares.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}