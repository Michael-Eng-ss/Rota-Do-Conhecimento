
-- Remover policies permissivas desnecessárias (service_role já bypassa RLS)
DROP POLICY "Service role full access campus" ON public.campus;
DROP POLICY "Service role full access curso" ON public.curso;
DROP POLICY "Service role full access categorias" ON public.categorias;
DROP POLICY "Service role full access perguntasnivel" ON public.perguntasnivel;
DROP POLICY "Service role full access usuarios" ON public.usuarios;
DROP POLICY "Service role full access quiz" ON public.quiz;
DROP POLICY "Service role full access perguntas" ON public.perguntas;
DROP POLICY "Service role full access alternativas" ON public.alternativas;
DROP POLICY "Service role full access progressoperguntas" ON public.progressoperguntas;
DROP POLICY "Service role full access quiz_avaliativo_usuario" ON public.quiz_avaliativo_usuario;
DROP POLICY "Service role full access logs" ON public.logs;
