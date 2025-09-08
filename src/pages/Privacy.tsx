import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>Personal Information</h4>
                <p>
                  When you create an account, we collect information such as your name, email address, phone number, 
                  and professional details including bar registration and firm information.
                </p>
                
                <h4>Case and Document Information</h4>
                <p>
                  We store the legal documents, case information, and related data that you upload to our platform 
                  to provide our case management services.
                </p>

                <h4>Usage Information</h4>
                <p>
                  We automatically collect information about how you use our Service, including log data, device information, 
                  and interaction patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We use your information to:</p>
                <ul>
                  <li>Provide and maintain the CourtTracker service</li>
                  <li>Process and store your legal documents securely</li>
                  <li>Send deadline reminders and important notifications</li>
                  <li>Improve our service and develop new features</li>
                  <li>Provide customer support</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul>
                  <li><strong>With your consent:</strong> When you explicitly authorize us to share information</li>
                  <li><strong>Service providers:</strong> With trusted third-party providers who assist in operating our service</li>
                  <li><strong>Legal requirements:</strong> When required by law, regulation, or court order</li>
                  <li><strong>Safety and security:</strong> To protect the rights, property, or safety of CourtTracker, our users, or others</li>
                  <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul>
                  <li>Data encryption in transit and at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  We cannot guarantee absolute security of your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We retain your information for as long as necessary to provide our services and fulfill our legal obligations:
                </p>
                <ul>
                  <li>Account information: Until you delete your account or after 3 years of inactivity</li>
                  <li>Case and document data: As long as you maintain your account or as required by law</li>
                  <li>Usage logs: Up to 2 years for security and service improvement purposes</li>
                </ul>
                <p>
                  Upon account deletion, we will delete your personal information within 30 days, except where retention 
                  is required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Depending on your location, you may have the following rights:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request limitation of processing your personal information</li>
                </ul>
                <p>To exercise these rights, please contact us at privacy@courttracker.com.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Attorney-Client Privilege</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We understand the sensitive nature of legal information. CourtTracker:
                </p>
                <ul>
                  <li>Does not waive attorney-client privilege by using our service</li>
                  <li>Implements technical and organizational measures to maintain confidentiality</li>
                  <li>Requires all employees to sign confidentiality agreements</li>
                  <li>Provides features to help you maintain ethical obligations</li>
                </ul>
                <p>
                  However, you remain responsible for ensuring compliance with applicable professional conduct rules 
                  and ethical obligations in your jurisdiction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Your information may be transferred to and processed in countries other than your own. When we transfer 
                  personal information internationally, we implement appropriate safeguards, including:
                </p>
                <ul>
                  <li>Standard contractual clauses approved by regulatory authorities</li>
                  <li>Adequacy decisions where available</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul>
                  <li>Maintain your session and preferences</li>
                  <li>Analyze usage patterns and improve our service</li>
                  <li>Provide security features</li>
                  <li>Enable certain functionality</li>
                </ul>
                <p>
                  You can control cookie settings through your browser, but disabling cookies may affect service functionality.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                  We will notify you of material changes by:
                </p>
                <ul>
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notification to registered users</li>
                  <li>Displaying a notice in the application</li>
                </ul>
                <p>Your continued use of the service after notification constitutes acceptance of the updated policy.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <p>
                  <strong>Email:</strong> privacy@courttracker.com<br />
                  <strong>Address:</strong> 123 Legal Street, Suite 456, Law City, LC 12345<br />
                  <strong>Phone:</strong> (555) 123-4567
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> dpo@courttracker.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;