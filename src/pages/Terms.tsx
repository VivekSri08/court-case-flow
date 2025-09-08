import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <Gavel className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">CourtTracker</span>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By accessing or using CourtTracker ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  CourtTracker is a web-based platform designed to help legal professionals manage court cases, track deadlines, 
                  and organize legal documents. The Service includes but is not limited to:
                </p>
                <ul>
                  <li>Document upload and storage</li>
                  <li>Deadline tracking and reminders</li>
                  <li>Case organization and management</li>
                  <li>Status tracking and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  To use certain features of the Service, you must create an account. You are responsible for:
                </p>
                <ul>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and complete information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>You agree not to use the Service to:</p>
                <ul>
                  <li>Upload or transmit malicious code, viruses, or harmful content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Use the Service for any unlawful purpose</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data and Privacy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Your use of the Service is also governed by our Privacy Policy. We implement appropriate security measures 
                  to protect your data, but you acknowledge that no method of transmission over the internet is 100% secure.
                </p>
                <p>
                  You retain ownership of all content you upload to the Service. By uploading content, you grant us a 
                  non-exclusive license to store, process, and display the content as necessary to provide the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Professional Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  CourtTracker is a tool to assist with case management. You acknowledge that:
                </p>
                <ul>
                  <li>The Service does not provide legal advice</li>
                  <li>You remain solely responsible for meeting all professional obligations and deadlines</li>
                  <li>You should verify all dates and deadlines independently</li>
                  <li>The Service should not replace your professional judgment</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Payment and Billing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Paid features of the Service are billed in advance on a monthly or annual basis. You agree to pay all charges 
                  associated with your account. We reserve the right to change our pricing with 30 days notice.
                </p>
                <p>
                  If payment is not received when due, we may suspend or terminate your access to paid features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, COURTTRACKER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, 
                  OR OTHER INTANGIBLE LOSSES.
                </p>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID 
                  US IN THE 12 MONTHS PRECEDING THE CLAIM.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Either party may terminate this agreement at any time. Upon termination:
                </p>
                <ul>
                  <li>Your access to the Service will cease</li>
                  <li>We will provide you with a reasonable opportunity to export your data</li>
                  <li>We may delete your data after a reasonable period</li>
                  <li>All provisions that should survive termination will remain in effect</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by email 
                  or through the Service. Your continued use of the Service after such notification constitutes acceptance 
                  of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p>
                  Email: legal@courttracker.com<br />
                  Address: 123 Legal Street, Suite 456, Law City, LC 12345
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;