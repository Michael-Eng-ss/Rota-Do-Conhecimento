
-- RLS policies for usuarios (service_role bypasses, but adds defense-in-depth)
-- Note: Edge Functions use service_role key, so these policies primarily protect against direct API access

-- RLS policies for logs table
CREATE POLICY "Service only logs" ON public.logs FOR ALL TO authenticated USING (false);

-- RLS policies for progressoperguntas
CREATE POLICY "Service only progressoperguntas" ON public.progressoperguntas FOR ALL TO authenticated USING (false);

-- RLS policies for quiz_avaliativo_usuario  
CREATE POLICY "Service only quiz_avaliativo_usuario" ON public.quiz_avaliativo_usuario FOR ALL TO authenticated USING (false);

-- RLS policies for usuarios
CREATE POLICY "Service only usuarios" ON public.usuarios FOR ALL TO authenticated USING (false);

-- Fix alternativas: replace public SELECT with authenticated-only (hides correta from anonymous)
DROP POLICY IF EXISTS "Public read alternativas" ON public.alternativas;
CREATE POLICY "Authenticated read alternativas" ON public.alternativas FOR SELECT TO authenticated USING (true);
