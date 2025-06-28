import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface SiteSettings {
  id: number
  company_name: string
  company_tagline: string
  city_name: string
  city_locative: string
  phone: string
  telegram: string
  email?: string
  address: string
  inn: string
  hero_title: string
  hero_subtitle: string
  hero_button_text: string
  hero_description: string
  perfect_choice_title: string
  perfect_choice_description: string
  contact_form_title: string
  contact_form_subtitle: string
  contact_form_subtitle_highlight: string
  form_name_placeholder: string
  form_phone_placeholder: string
  form_privacy_text: string
  form_submit_button: string
  nav_home: string
  nav_catalog: string
  nav_services: string
  nav_contacts: string
  nav_blog: string
  nav_cooperation: string
  footer_privacy_policy: string
  footer_user_agreement: string
  header_connect_button: string
  logo_short: string
  logo_full_line1: string
  logo_full_line2: string
  created_at: string
  updated_at: string
}

function replaceTemplateVariables(text: string, settings: SiteSettings): string {
  return text
    .replace(/{company_name}/g, settings.company_name)
    .replace(/{city_name}/g, settings.city_name)
    .replace(/{city_locative}/g, settings.city_locative)
    .replace(/{contact_form_subtitle_highlight}/g, settings.contact_form_subtitle_highlight)
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const response = await fetch('/api/site-settings')
      if (!response.ok) {
        throw new Error('Ошибка получения настроек')
      }
      const data = await response.json()
      return data.settings
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useProcessedSiteSettings() {
  const { data: settings, ...query } = useSiteSettings()
  
  if (!settings) {
    return { settings: null, ...query }
  }

  const processedSettings = {
    ...settings,
    hero_title: replaceTemplateVariables(settings.hero_title, settings),
    hero_description: replaceTemplateVariables(settings.hero_description, settings),
    contact_form_subtitle: replaceTemplateVariables(settings.contact_form_subtitle, settings),
  }

  return { settings: processedSettings, ...query }
}

export function useAdminSiteSettings() {
  return useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const response = await fetch('/api/admin/site-settings')
      if (!response.ok) {
        throw new Error('Ошибка получения настроек')
      }
      const data = await response.json()
      return data.settings
    },
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка обновления настроек')
      }
      
      const data = await response.json()
      return data.settings
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] })
    },
  })
}

export function useResetSiteSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (): Promise<SiteSettings> => {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка сброса настроек')
      }
      
      const data = await response.json()
      return data.settings
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] })
    },
  })
} 