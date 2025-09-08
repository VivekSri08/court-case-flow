import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Clock, Shield, Star, Users, Gavel, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Gavel className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">CourtTracker</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/terms" className="text-foreground/80 hover:text-foreground transition-colors">Terms</Link>
              <Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">Privacy</Link>
            </div>
            <div className="flex space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Never Miss a Court Deadline Again
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Streamline Your
            <span className="text-primary"> Court Case Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload court orders, track deadlines, manage case documents, and stay organized with our intelligent legal case management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Court Cases
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for legal professionals to stay organized and never miss important deadlines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Upload and organize court orders, case status updates, and completion documents in one secure location.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Deadline Tracking</CardTitle>
                <CardDescription>
                  Automated deadline extraction from court orders with smart reminders to ensure you never miss critical dates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure & Compliant</CardTitle>
                <CardDescription>
                  Bank-grade security with encryption at rest and in transit. Fully compliant with legal industry standards.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Case Organization</CardTitle>
                <CardDescription>
                  Organize cases by urgency, status, and court. Powerful search and filtering to find what you need instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Gavel className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Status Tracking</CardTitle>
                <CardDescription>
                  Track case progress from pending to completion with detailed status updates and action items.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Get insights into your case load, completion rates, and performance metrics to optimize your practice.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your practice size and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for solo practitioners</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Up to 50 cases
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Document storage
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Deadline tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Email support
                  </li>
                </ul>
                <Button className="w-full mt-6">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit">Most Popular</Badge>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing law firms</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Up to 200 cases
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Team collaboration
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    API access
                  </li>
                </ul>
                <Button className="w-full mt-6">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Unlimited cases
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    SLA guarantee
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    On-premise deployment
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Legal Professionals Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted by law firms and legal professionals across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "CourtTracker has transformed how we manage our case load. No more missed deadlines and everything is organized in one place."
                </p>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Partner, Johnson & Associates</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The deadline tracking feature alone has saved us countless hours and prevented potential malpractice issues."
                </p>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Solo Practitioner</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Excellent platform with outstanding customer support. It's become an essential tool for our practice."
                </p>
                <div>
                  <p className="font-semibold">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Legal Director, Rodriguez Law Firm</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of legal professionals who trust CourtTracker to manage their cases efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Gavel className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-bold">CourtTracker</span>
              </div>
              <p className="text-muted-foreground">
                Professional court case management for modern legal practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CourtTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;