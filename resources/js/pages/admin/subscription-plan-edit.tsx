import React, { useState, useRef } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { X } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionPlan {
  id?: number;
  name: string;
  price: number;
  currency: string;
  billing_period: string;
  description: string;
  estimated_duration: string;
  daily_quran_sessions: boolean;
  weekly_assessments: boolean;
  progress_tracking_dashboard: boolean;
  final_certificate: boolean;
  personalized_learning_plan: boolean;
  tags: string[];
  is_active: boolean;
  image?: string;
}

interface SubscriptionPlanFormData extends Record<string, any> {
  id?: number;
  name: string;
  price: number;
  currency: string;
  billing_period: string;
  description: string;
  estimated_duration: string;
  daily_quran_sessions: boolean;
  weekly_assessments: boolean;
  progress_tracking_dashboard: boolean;
  final_certificate: boolean;
  personalized_learning_plan: boolean;
  tags: string[];
  is_active: boolean;
  image?: string;
}

interface Props {
  plan?: SubscriptionPlan;
}

const SubscriptionPlanEdit: React.FC<Props> = ({ plan }) => {
  const { toast } = useToast();
  const { data, setData, errors, processing } = useForm<SubscriptionPlanFormData>({
    id: plan?.id || undefined,
    name: plan?.name || '',
    price: plan?.price || 0,
    currency: plan?.currency || 'Naira',
    billing_period: plan?.billing_period || 'month',
    description: plan?.description || '',
    estimated_duration: plan?.estimated_duration || '3 Months',
    daily_quran_sessions: plan?.daily_quran_sessions || false,
    weekly_assessments: plan?.weekly_assessments || false,
    progress_tracking_dashboard: plan?.progress_tracking_dashboard || false,
    final_certificate: plan?.final_certificate || false,
    personalized_learning_plan: plan?.personalized_learning_plan || false,
    tags: plan?.tags || [],
    is_active: plan?.is_active ?? true,
    image: plan?.image || '',
  });

  const [newTag, setNewTag] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object for file uploads
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'tags' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'image' || value !== '') {
        // Convert boolean values to strings
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    });
    
    // Add file if selected
    if (fileInput.current && fileInput.current.files && fileInput.current.files[0]) {
      formData.append('image', fileInput.current.files[0]);
    }

    // Debug: Log form data being sent
    console.log('Form data being submitted:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Helper function to format field names
    const formatFieldName = (field: string) => {
      return field
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Helper function to format error messages
    const formatErrorMessages = (errors: Record<string, string>) => {
      if (Object.keys(errors).length === 0) {
        return "An unknown error occurred";
      }
      
      // Check if errors is an array or object with nested structure
      if (typeof errors === 'object' && errors !== null) {
        let formattedErrors = '';
        
        // Handle different error formats from Laravel
        if (Array.isArray(errors)) {
          formattedErrors = errors.join('\n');
        } else {
          Object.entries(errors).forEach(([field, message]) => {
            const fieldName = formatFieldName(field);
            
            if (Array.isArray(message)) {
              message.forEach(msg => {
                formattedErrors += `• ${fieldName}: ${msg}\n`;
              });
            } else if (typeof message === 'string') {
              formattedErrors += `• ${fieldName}: ${message}\n`;
            } else if (typeof message === 'object' && message !== null) {
              formattedErrors += `• ${fieldName}: ${JSON.stringify(message)}\n`;
            }
          });
        }
        
        return formattedErrors.trim();
      }
      
      return "Unexpected error format";
    };

    if (plan?.id) {
      router.post(route('admin.subscription-plans.update', plan.id), formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Subscription plan updated successfully",
            variant: "success",
          });
        },
        onError: (errors) => {
          toast({
            title: "Validation Error",
            description: formatErrorMessages(errors),
            variant: "destructive",
          });
          
          // Detailed error logging
          console.error("Form validation errors:", errors);
          console.error("Raw error object:", JSON.stringify(errors, null, 2));
        }
      });
    } else {
      router.post(route('admin.subscription-plans.store'), formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Subscription plan created successfully",
            variant: "success",
          });
        },
        onError: (errors) => {
          toast({
            title: "Validation Error",
            description: formatErrorMessages(errors),
            variant: "destructive",
          });
          
          // Detailed error logging
          console.error("Form validation errors:", errors);
          console.error("Raw error object:", JSON.stringify(errors, null, 2));
        }
      });
    }
  };

  const addTag = () => {
    if (newTag && !data.tags.includes(newTag)) {
      setData('tags', [...data.tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setData('tags', data.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AdminLayout>
      <Head title={plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'} />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Subscription & Plans Management', href: '/admin/subscription-plans' },
                { title: plan?.name ? `Edit Subscription Plan - ${plan.name}` : 'Create Subscription Plan' }
              ]}
            />
          </div>
        </div>
        <div className="max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden" encType="multipart/form-data">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Information</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Full Quran Memorization"
                    className="mt-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    placeholder="Dedicated Quran teacher with 10+ A comprehensive memorization program for students aiming to memorize the entire Quran/years of experience in Hifz and Tajweed."
                    className="mt-1 h-24"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Pricing & Billing</Label>
                    <Input
                      id="price"
                      type="number"
                      value={data.price}
                      onChange={e => setData('price', parseFloat(e.target.value))}
                      placeholder="50,000"
                      className="mt-1"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billing_period">Billing Cycle</Label>
                    <Select
                      value={data.billing_period}
                      onValueChange={value => setData('billing_period', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.billing_period && <p className="text-red-500 text-sm mt-1">{errors.billing_period}</p>}
                  </div>
                </div>

                <div>
                  <Label>Currency Option</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="currency-naira"
                        checked={data.currency === 'Naira'}
                        onCheckedChange={() => setData('currency', 'Naira')}
                      />
                      <label htmlFor="currency-naira" className="ml-2 text-sm font-medium">
                        Naira
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="currency-dollar"
                        checked={data.currency === 'Dollar'}
                        onCheckedChange={() => setData('currency', 'Dollar')}
                      />
                      <label htmlFor="currency-dollar" className="ml-2 text-sm font-medium">
                        Dollar
                      </label>
                    </div>
                  </div>
                  {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.tags.map(tag => (
                      <div key={tag} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-sm">#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex">
                      <Input
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add New"
                        className="w-24 h-8 text-sm"
                      />
                      <Button 
                        type="button" 
                        onClick={addTag} 
                        variant="ghost" 
                        className="h-8 px-2 text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Plan Feature</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="daily_quran_sessions"
                        checked={data.daily_quran_sessions}
                        onCheckedChange={checked => 
                          setData('daily_quran_sessions', checked === true)
                        }
                      />
                      <label htmlFor="daily_quran_sessions" className="ml-2 text-sm font-medium">
                        Daily Quran Sessions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="weekly_assessments"
                        checked={data.weekly_assessments}
                        onCheckedChange={checked => 
                          setData('weekly_assessments', checked === true)
                        }
                      />
                      <label htmlFor="weekly_assessments" className="ml-2 text-sm font-medium">
                        Weekly Assessments
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="progress_tracking_dashboard"
                        checked={data.progress_tracking_dashboard}
                        onCheckedChange={checked => 
                          setData('progress_tracking_dashboard', checked === true)
                        }
                      />
                      <label htmlFor="progress_tracking_dashboard" className="ml-2 text-sm font-medium">
                        Progress Tracking Dashboard
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="final_certificate"
                        checked={data.final_certificate}
                        onCheckedChange={checked => 
                          setData('final_certificate', checked === true)
                        }
                      />
                      <label htmlFor="final_certificate" className="ml-2 text-sm font-medium">
                        Final Certificate on Completion
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="personalized_learning_plan"
                        checked={data.personalized_learning_plan}
                        onCheckedChange={checked => 
                          setData('personalized_learning_plan', checked === true)
                        }
                      />
                      <label htmlFor="personalized_learning_plan" className="ml-2 text-sm font-medium">
                        Personalized Learning Plan
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Plan Image (Optional)</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block">
                        <span className="sr-only">Choose plan image</span>
                        <input
                          type="file"
                          ref={fileInput}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100
                          "
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="estimated_duration">Estimated Duration</Label>
                    <Select
                      value={data.estimated_duration}
                      onValueChange={value => setData('estimated_duration', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Month">1 Month</SelectItem>
                        <SelectItem value="3 Months">3 Months</SelectItem>
                        <SelectItem value="6 Months">6 Months</SelectItem>
                        <SelectItem value="12 Months">12 Months</SelectItem>
                        <SelectItem value="24 Months">24 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="status-active"
                        checked={data.is_active === true}
                        onCheckedChange={() => setData('is_active', true)}
                      />
                      <label htmlFor="status-active" className="ml-2 text-sm font-medium">
                        Active
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="status-inactive"
                        checked={data.is_active === false}
                        onCheckedChange={() => setData('is_active', false)}
                      />
                      <label htmlFor="status-inactive" className="ml-2 text-sm font-medium">
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <Link href={route('admin.subscription-plans.index')}>
                <Button type="button" variant="outline" className="text-red-500 border-red-500">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={processing}>
                Save Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionPlanEdit; 