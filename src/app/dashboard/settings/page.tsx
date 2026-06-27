import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-background px-4 md:px-8 py-8 relative w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your account preferences, system configurations, and
            security.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Make changes to your institutional profile here. Click save
                  when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-left">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Wanjiku Njeri" />
                </div>
                <div className="space-y-1 text-left">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" defaultValue="wanjiku@kredo.co.ke" />
                </div>
                <div className="space-y-1 text-left">
                  <Label htmlFor="role">Institutional Role</Label>
                  <Input
                    id="role"
                    defaultValue="Senior Credit Analyst"
                    disabled
                    className="bg-muted/50"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive alerts for evaluation results and
                  system events.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Checkbox id="notify-eval" defaultChecked />
                  <Label htmlFor="notify-eval" className="font-normal">
                    Email me when a pending Farmer Evaluation is completed
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="notify-risk" defaultChecked />
                  <Label
                    htmlFor="notify-risk"
                    className="text-destructive font-medium"
                  >
                    Critical Alert: Notify me on high-risk portfolio deviations
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="notify-system" />
                  <Label htmlFor="notify-system" className="font-normal">
                    Weekly system audit logs
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>
                  Manage your password and Multi-Factor Authentication (MFA)
                  settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-left">
                  <Label htmlFor="current-pwd">Current Password</Label>
                  <Input id="current-pwd" type="password" />
                </div>
                <div className="space-y-1 text-left">
                  <Label htmlFor="new-pwd">New Password</Label>
                  <Input id="new-pwd" type="password" />
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md mt-6">
                  <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-500 mb-1">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mb-3">
                    MFA is currently required for all Credit Analysts by
                    institutional policy.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-600 dark:text-amber-500"
                  >
                    Configure Authenticator App
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Security</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
