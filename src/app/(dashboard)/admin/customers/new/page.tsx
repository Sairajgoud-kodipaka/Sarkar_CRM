'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { DashboardLayout } from '@/components/layout';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  MapPin, 
  Target, 
  Plus, 
  Trash2, 
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';

// Form validation schema
const customerFormSchema = z.object({
  // Customer Details
  assignedSalesperson: z.string().min(1, 'Salesperson is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  birthDate: z.string().optional(),
  anniversaryDate: z.string().optional(),
  
  // Demographics & Visit
  community: z.string().min(1, 'Community is required'),
  motherTongue: z.string().min(1, 'Mother tongue is required'),
  reasonForVisit: z.string().min(1, 'Reason for visit is required'),
  ageOfEndUser: z.string().min(1, 'Age group is required'),
  leadSource: z.string().min(1, 'Lead source is required'),
  monthlySavingScheme: z.string().min(1, 'Monthly saving scheme is required'),
  
  // Customer Interests
  interests: z.array(z.object({
    mainCategory: z.string().min(1, 'Main category is required'),
    designSelected: z.boolean().default(false),
    wantsMoreDiscount: z.boolean().default(false),
    checkingOtherJewellers: z.boolean().default(false),
    feltLessVariety: z.boolean().default(false),
    otherPreferences: z.string().optional(),
  })).min(1, 'At least one interest is required'),
  
  // Additional Notes
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

// Mock data for dropdowns
const salespeople = [
  { id: '1', name: 'Usharbhai' },
  { id: '2', name: 'Priya Patel' },
  { id: '3', name: 'Amit Kumar' },
  { id: '4', name: 'Neha Singh' },
];

const communities = [
  'Gujarati',
  'Marwari',
  'Punjabi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Other'
];

const reasonsForVisit = [
  'Wedding Shopping',
  'Birthday Gift',
  'Anniversary Gift',
  'Investment',
  'Regular Purchase',
  'Replacement',
  'Other'
];

const ageGroups = [
  '18-25',
  '26-35',
  '36-45',
  '46-55',
  '56-65',
  '65+'
];

const leadSources = [
  'Walk-in',
  'Referral',
  'Social Media',
  'Advertisement',
  'Website',
  'Phone Call',
  'Other'
];

const monthlySavingSchemes = [
  'Yes - Active',
  'Yes - Inactive',
  'No - Not Interested',
  'No - Will Consider'
];

const mainCategories = [
  'Gold Necklace',
  'Gold Ring',
  'Diamond Ring',
  'Diamond Necklace',
  'Silver Jewelry',
  'Platinum Jewelry',
  'Pearl Jewelry',
  'Gemstone Jewelry',
  'Other'
];

export default function AddCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      assignedSalesperson: '1', // Default to Usharbhai
      interests: [
        {
          mainCategory: '',
          designSelected: false,
          wantsMoreDiscount: false,
          checkingOtherJewellers: false,
          feltLessVariety: false,
          otherPreferences: '',
        }
      ]
    }
  });

  const watchedInterests = watch('interests');

  const addInterest = () => {
    const currentInterests = watch('interests');
    setValue('interests', [
      ...currentInterests,
      {
        mainCategory: '',
        designSelected: false,
        wantsMoreDiscount: false,
        checkingOtherJewellers: false,
        feltLessVariety: false,
        otherPreferences: '',
      }
    ]);
  };

  const removeInterest = (index: number) => {
    const currentInterests = watch('interests');
    if (currentInterests.length > 1) {
      setValue('interests', currentInterests.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Customer data:', data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/customers');
      }, 1500);
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Added Successfully!</h2>
              <p className="text-gray-600">Redirecting to customers list...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Add New Customer / Visit Log"
        description="Enter customer details, track revenue opportunities, and convert leads to sales."
        showBackButton
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </CardTitle>
            <CardDescription>Basic information about the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned Salesperson */}
              <div className="space-y-2">
                <Label htmlFor="assignedSalesperson" className="text-sm font-medium">
                  Assigned Salesperson *
                </Label>
                <Controller
                  name="assignedSalesperson"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Salesperson" />
                      </SelectTrigger>
                      <SelectContent>
                        {salespeople.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignedSalesperson && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.assignedSalesperson.message}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Lock className="h-3 w-3" />
                  Locked: Customers are automatically assigned to you
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., Priya Sharma"
                      className="h-11"
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number (India) *
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="+91 98XXXXXX00"
                      className="h-11"
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="e.g., priya.sharma@example.com"
                      className="h-11"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium">
                  Birth Date
                </Label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="h-11"
                    />
                  )}
                />
              </div>

              {/* Anniversary Date */}
              <div className="space-y-2">
                <Label htmlFor="anniversaryDate" className="text-sm font-medium">
                  Anniversary Date
                </Label>
                <Controller
                  name="anniversaryDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className="h-11"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demographics & Visit Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Demographics & Visit
            </CardTitle>
            <CardDescription>Customer background and visit information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Community */}
              <div className="space-y-2">
                <Label htmlFor="community" className="text-sm font-medium">
                  Community *
                </Label>
                <Controller
                  name="community"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Community" />
                      </SelectTrigger>
                      <SelectContent>
                        {communities.map((community) => (
                          <SelectItem key={community} value={community}>
                            {community}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.community && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.community.message}
                  </p>
                )}
              </div>

              {/* Mother Tongue */}
              <div className="space-y-2">
                <Label htmlFor="motherTongue" className="text-sm font-medium">
                  Mother Tongue / Sub-community *
                </Label>
                <Controller
                  name="motherTongue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., Gujarati, Marwari Jain"
                      className="h-11"
                    />
                  )}
                />
                {errors.motherTongue && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.motherTongue.message}
                  </p>
                )}
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <Label htmlFor="reasonForVisit" className="text-sm font-medium">
                  Reason for Visit *
                </Label>
                <Controller
                  name="reasonForVisit"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonsForVisit.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.reasonForVisit && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.reasonForVisit.message}
                  </p>
                )}
              </div>

              {/* Age of End User */}
              <div className="space-y-2">
                <Label htmlFor="ageOfEndUser" className="text-sm font-medium">
                  Age of End-User *
                </Label>
                <Controller
                  name="ageOfEndUser"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Age Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.ageOfEndUser && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ageOfEndUser.message}
                  </p>
                )}
              </div>

              {/* Lead Source */}
              <div className="space-y-2">
                <Label htmlFor="leadSource" className="text-sm font-medium">
                  Lead Source *
                </Label>
                <Controller
                  name="leadSource"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.leadSource && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.leadSource.message}
                  </p>
                )}
              </div>

              {/* Monthly Saving Scheme */}
              <div className="space-y-2">
                <Label htmlFor="monthlySavingScheme" className="text-sm font-medium">
                  Monthly Saving Scheme *
                </Label>
                <Controller
                  name="monthlySavingScheme"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthlySavingSchemes.map((scheme) => (
                          <SelectItem key={scheme} value={scheme}>
                            {scheme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.monthlySavingScheme && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.monthlySavingScheme.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Interests Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Customer Interests
                </CardTitle>
                <CardDescription>Track customer preferences and interests</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInterest}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Interest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {watchedInterests.map((interest, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Interest Item #{index + 1}</h4>
                  {watchedInterests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInterest(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Main Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Main Category *
                  </Label>
                  <Controller
                    name={`interests.${index}.mainCategory`}
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Main Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.interests?.[index]?.mainCategory && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.interests[index]?.mainCategory?.message}
                    </p>
                  )}
                </div>

                {/* Customer Preference */}
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Customer Preference</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`interests.${index}.designSelected`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`designSelected-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`designSelected-${index}`} className="text-sm">
                        Design Selected?
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`interests.${index}.wantsMoreDiscount`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`wantsMoreDiscount-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`wantsMoreDiscount-${index}`} className="text-sm">
                        Wants More Discount
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`interests.${index}.checkingOtherJewellers`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`checkingOtherJewellers-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`checkingOtherJewellers-${index}`} className="text-sm">
                        Checking Other Jewellers
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`interests.${index}.feltLessVariety`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`feltLessVariety-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`feltLessVariety-${index}`} className="text-sm">
                        Felt Less Variety
                      </Label>
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Other Preferences (if any)
                    </Label>
                    <Controller
                      name={`interests.${index}.otherPreferences`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="e.g., Specific customization request"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            {errors.interests && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.interests.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Additional Notes
            </CardTitle>
            <CardDescription>Any additional information about the customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter any additional notes about the customer..."
                  className="min-h-[100px]"
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Customer...
              </>
            ) : (
              'Add Customer'
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
} 