import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  logging: false,
});

// ── Mapeamento questão → categoria ──────────────────────────────────────────
// Grupo 1 (cat 1) — 20q: Literatura Q1-4, L.Inglesa Q13-16, Mat Q25-28, Geo Q69-72, Hist Q79-82
// Grupo 2 (cat 2) — 20q: L.Port Q5-9, Física Q37-41, Química Q49-53, Biologia Q59-63
// Grupo 3 (cat 3) — 40q: Port Q10-12, Ing Q17-22, Mat Q29-34, Fis Q42-47,
//                         Quim Q54-57, Bio Q64-67, Geo Q73-75, Hist Q83-84, Atual Q85-90
// Não utilizadas: Q23,Q24,Q35,Q36,Q48,Q58,Q68,Q76,Q77,Q78
const CAT: Record<number,number> = {
  1:1,2:1,3:1,4:1,
  13:1,14:1,15:1,16:1,
  25:1,26:1,27:1,28:1,
  69:1,70:1,71:1,72:1,
  79:1,80:1,81:1,82:1,

  5:2,6:2,7:2,8:2,9:2,
  37:2,38:2,39:2,40:2,41:2,
  49:2,50:2,51:2,52:2,53:2,
  59:2,60:2,61:2,62:2,63:2,

  10:3,11:3,12:3,
  17:3,18:3,19:3,20:3,21:3,22:3,
  29:3,30:3,31:3,32:3,33:3,34:3,
  42:3,43:3,44:3,45:3,46:3,47:3,
  54:3,55:3,56:3,57:3,
  64:3,65:3,66:3,67:3,
  73:3,74:3,75:3,
  83:3,84:3,
  85:3,86:3,87:3,88:3,89:3,90:3,
};

// Gabarito: índice da alternativa correta (0=A,1=B,2=C,3=D)
const G: Record<number,number> = {
  1:1,2:2,3:0,4:1,5:2,6:1,7:2,8:0,9:2,10:2,11:3,12:1,
  13:2,14:2,15:1,16:1,17:0,18:1,19:2,20:1,21:0,22:1,23:1,24:2,
  25:2,26:2,27:2,28:0,29:1,30:1,31:1,32:2,33:1,34:1,35:1,36:2,
  37:2,38:1,39:0,40:1,41:1,42:2,43:1,44:0,45:2,46:0,47:2,48:2,
  49:2,50:2,51:2,52:0,53:0,54:1,55:1,56:1,57:1,58:1,
  59:2,60:2,61:2,62:0,63:1,64:1,65:2,66:1,67:2,68:0,
  69:1,70:1,71:1,72:1,73:0,74:0,75:0,76:0,77:0,78:1,
  79:2,80:0,81:1,82:1,83:1,84:2,
  85:1,86:1,87:1,88:1,89:1,90:1,
};

type Q=[number,string,[string,string,string,string]];

// Grupo 1 (Auditório, cat 1): L.Inglesa Q13-24, Matemática Q25-36, Geografia Q69-78, História Q79-84
// Grupo 2 (Biblioteca, cat 2): L.Portuguesa Q1-12, Física Q37-48, Química Q49-58, Biologia Q59-68
// Grupo 3 (Boss Final, cat 3): Atualidades Q85-90
function getCat(n:number):number {
  if (n>=13&&n<=36) return 1;
  if (n>=69&&n<=84) return 1;
  if (n>=1&&n<=12)  return 2;
  if (n>=37&&n<=68) return 2;
  return 3; // 85-90
}
function getNivel(cat:number):number { return cat; } // cat1=nível1, cat2=nível2, cat3=nível3

const QUESTOES:Q[]=[
  [1,'O "modelo do déficit" na comunicação política baseia-se na premissa de que:',['Os políticos têm déficit de oratória e por isso não convencem os eleitores','A falta de informação do público é o problema; suprindo-a, o comportamento se altera','O eleitorado possui déficit de atenção e ignora propostas complexas','O carisma do candidato supre qualquer falta de informação no debate público']],
  [2,'A concordância verbal de acordo com a norma culta está em:',['Fazem cinco anos que iniciei minha graduação','Haviam muitos alunos na palestra de ontem','Mais de um candidato se inscreveu para a vaga','Houveram reclamações sobre o novo sistema']],
  [3,'Em "haviam chegado novos documentos", a correção exige substituir "haviam" por:',['havia','houveram','tinha','existia']],
  [4,'A ideia central do texto sobre ciência é que:',['As certezas científicas são definitivas e imutáveis','O conhecimento científico progride pela superação de teorias anteriores','O acúmulo de dados é o único motor do avanço científico','Fenômenos observados independem de teorias explicativas']],
  [5,'O uso da crase é facultativo em:',['Entreguei o relatório à diretora','Refiro-me àquela aluna','Voltei à casa dos meus pais','Fui à praia no domingo']],
  [6,'Em "O professor entregou os gabaritos aos alunos", "aos alunos" exerce função de:',['Sujeito','Objeto direto','Objeto indireto','Adjunto adverbial']],
  [7,'Apresenta erro de regência verbal:',['Prefiro estudar a trabalhar','Assistimos ao filme ontem','Lembrei do seu aniversário','Obedeça às regras do concurso']],
  [8,'"A notícia se espalhou rapidamente." O termo "rapidamente" é um:',['Advérbio de modo','Adjetivo','Substantivo','Pronome indefinido']],
  [9,'Todas as palavras são paroxítonas em:',['Café, sofá, jiló','Táxi, lápis, vírus','Mesa, cadeira, livro','Amável, útil, fóssil']],
  [10,'O texto sobre democracia defende que:',['A democracia, uma vez estabelecida, dispensa manutenção','A cidadania se resume ao ato de votar periodicamente','A democracia requer envolvimento contínuo dos cidadãos','A vigilância constante é responsabilidade exclusiva do Estado']],
  [11,'A colocação pronominal está correta em:',['Me entregue o documento amanhã','Não se preocupe com os detalhes','Farei-te saber da decisão','Alguém me disse que tudo deu certo']],
  [12,'Em "Ele estava meio cansado", "meio" é:',['Adjetivo','Advérbio','Substantivo','Numeral']],
  [13,'The Mediterranean diet is best described as:',['A strict meal plan designed exclusively for weight loss','A temporary eating regimen to lower cholesterol levels','A lifestyle approach combining healthy eating with traditional culinary practices','A medical treatment prescribed for cardiovascular diseases']],
  [14,'Which best describes a consequence of power abuse in the workplace?',['Increased team productivity and motivation','Enhanced psychological safety and trust among employees','Compromised psychological safety and trust','Greater collaboration between managers and employees']],
  [15,'The text compares João Fonseca to a rockstar because:',['He plays music professionally','He has achieved immense popularity and fan enthusiasm','He performs concerts during tennis matches','He is a famous singer in Brazil']],
  [16,'Front-of-package labels are designed to:',['Replace the back-of-package information entirely','Make key nutritional information simpler and more visible','Eliminate the need for ingredient lists','Increase the complexity of nutritional data']],
  [17,'Choose the correct alternative: If I ______ more time, I would have finished on time.',['had had','have','would have','had']],
  [18,'The word "conducted" can be replaced by:',['Ignored','Carried out','Cancelled','Written']],
  [19,'She is the professor ______ classes are the most popular.',['who','which','whose','whom']],
  [20,'The expression "not only... but also" indicates:',['Contrast','Addition','Condition','Conclusion']],
  [21,'Correct passive voice for "The committee approved the new policy":',['The new policy was approved by the committee','The new policy is approved by the committee','The new policy has been approved by the committee','The new policy were approved by the committee']],
  [22,'The word "significantly" means:',['Slightly','Considerably','Rarely','Temporarily']],
  [23,'There ______ many reasons why students choose to study abroad.',['is','are','was','has']],
  [24,'Which sentence is grammatically correct?',["He don't like to wake up early","She doesn't speaks French fluently","They didn't arrive on time for the meeting","We doesn't have class tomorrow"]],
  [25,'Para a loja ter lucro com C(x)=500+25x e R(x)=45x, o mínimo de camisetas é:',['20','25','26','30']],
  [26,'Em pesquisa com 300 alunos (180 transporte, 120 bicicleta, 60 ambos), sem nenhum dos dois:',['30','40','60','80']],
  [27,'Valor de x em: 3(x-4)+8=2x+5:',['7','8','9','10']],
  [28,'R$ 5.000 a juros simples de 1,5% a.m. por 8 meses resulta em:',['R$ 5.600,00','R$ 5.800,00','R$ 6.000,00','R$ 6.200,00']],
  [29,'PA com a₁=3 e r=5. O 20º termo é:',['95','98','100','103']],
  [30,'Área de círculo com raio 7 cm (π≈3,14):',['143,86 cm²','153,86 cm²','163,86 cm²','173,86 cm²']],
  [31,'As raízes de f(x)=x²-6x+8 são:',['2 e 3','2 e 4','3 e 5','4 e 6']],
  [32,'Com 40 alunos e média 7,2, a soma total das notas é:',['248','268','288','308']],
  [33,'O logaritmo de 125 na base 5 é:',['2','3','4','5']],
  [34,'Caixa com 6 azuis, 4 verdes e 2 amarelas. P(verde)=',['1/2','1/3','1/4','1/6']],
  [35,'8 operários constroem muro em 15 dias. Para 10 dias, necessários:',['10','12','14','16']],
  [36,'f(x)=2x+3. O valor de f(5)-f(2) é:',['4','5','6','7']],
  [37,'Fótons com λ=300nm; h=4,14×10⁻¹⁵eV·s; c=3×10⁸m/s. Energia do fóton:',['2,0 eV','3,0 eV','4,1 eV','5,0 eV']],
  [38,'Com função trabalho 3,0eV e fóton ~4,1eV, é correto afirmar:',['O efeito fotoelétrico não ocorrerá pois a energia é menor que a função trabalho','O efeito fotoelétrico ocorrerá e o elétron será ejetado com energia cinética','O efeito fotoelétrico ocorrerá mas o elétron não terá energia cinética residual','O efeito fotoelétrico depende apenas da intensidade da radiação']],
  [39,'Bobina circular r=0,05m, 50 espiras, I=2A, μ₀=4π×10⁻⁷. Campo magnético central:',['1,26×10⁻³ T','2,51×10⁻³ T','5,02×10⁻³ T','1,00×10⁻² T']],
  [40,'Imagem de objeto além do centro de curvatura numa lente convergente:',['Virtual, direita e menor','Real, invertida e menor','Virtual, invertida e maior','Real, direita e maior']],
  [41,'Corpo 2kg lançado a 20m/s verticalmente (g=10m/s²). Altura máxima:',['15 m','20 m','25 m','30 m']],
  [42,'Resistor 10Ω com corrente 3A. Potência dissipada:',['30 W','60 W','90 W','120 W']],
  [43,'Plataforma 40kg + praticante 70kg (g=10m/s²). Força normal da água:',['700 N','1100 N','1400 N','400 N']],
  [44,'Na ressonância magnética, as imagens se formam porque:',['Os núcleos de hidrogênio se alinham com o campo magnético e emitem sinais ao serem estimulados','A radiação ionizante interage com os tecidos produzindo imagens','Os elétrons dos átomos são arrancados pelo campo magnético','O calor gerado pela bobina é captado por sensores térmicos']],
  [45,'Carro percorre 120km em 2h. Velocidade média em m/s:',['10,7 m/s','12,5 m/s','16,7 m/s','20,0 m/s']],
  [46,'A 2ª lei de Newton: força resultante é igual a:',['Massa vezes aceleração','Massa vezes velocidade','Massa vezes deslocamento','Massa vezes impulso']],
  [47,'Resistores 6Ω, 3Ω e 2Ω em série. Resistência equivalente:',['1 Ω','6 Ω','11 Ω','36 Ω']],
  [48,'Onda sonora 440Hz a 340m/s. Comprimento de onda:',['0,55 m','0,65 m','0,77 m','0,85 m']],
  [49,'Sobre os éteres, está correto:',['São apolares e insolúveis em água em qualquer proporção','O éter dimetílico é líquido devido às ligações de hidrogênio','O éter etílico possui maior ponto de ebulição que o dimetílico pela maior massa molar','Todos os éteres são sólidos à temperatura ambiente']],
  [50,'pH de solução com [H⁺]=1×10⁻⁴mol/L:',['2','3','4','5']],
  [51,'Elementos do grupo 17 (halogênios) possuem na camada de valência:',['1 elétron','5 elétrons','7 elétrons','8 elétrons']],
  [52,'Ligação química entre metal e não metal é predominantemente:',['Iônica','Covalente','Metálica','Dipolo-dipolo']],
  [53,'Neutralização entre HCl e NaOH produz:',['NaCl e H₂O','HClO e NaH','NaClO e H₂','NaHCl e O₂']],
  [54,'Número de mols em 36g de H₂O:',['1 mol','2 mols','3 mols','4 mols']],
  [55,'Fórmula molecular do etanol:',['CH₄','C₂H₆O','C₃H₈O','CH₃OH']],
  [56,'Solução de NaCl 0,5mol/L em 2 litros contém:',['0,5 mol de NaCl','1,0 mol de NaCl','1,5 mol de NaCl','2,0 mol de NaCl']],
  [57,'Carbono apresenta hibridação sp² em compostos com:',['Apenas ligações simples','Pelo menos uma ligação dupla','Pelo menos uma ligação tripla','Apenas ligações sigma']],
  [58,'A oxidação do etanol produz:',['Metano','Ácido acético','Éter etílico','Propano']],
  [59,'Síndrome de Down é mutação cromossômica do tipo:',['Deleção','Inversão','Trissomia','Translocação']],
  [60,'Células eucarióticas se diferenciam das procarióticas por possuírem:',['Ribossomos','Membrana plasmática','Núcleo organizado com carioteca','Material genético disperso no citoplasma']],
  [61,'A fotossíntese ocorre nos:',['Ribossomos','Lisossomos','Cloroplastos','Complexo de Golgi']],
  [62,'Bases nitrogenadas que se pareiam por duas ligações de hidrogênio no DNA:',['Adenina e Timina','Guanina e Citosina','Adenina e Guanina','Timina e Citosina']],
  [63,'A glicólise ocorre:',['No interior das mitocôndrias','No citoplasma da célula','No núcleo celular','Nos ribossomos']],
  [64,'O sistema ABO é exemplo de:',['Herança ligada ao sexo','Alelos múltiplos','Dominância incompleta','Epistasia']],
  [65,'Mutações gênicas são alterações:',['No número de cromossomos','Na estrutura dos cromossomos','Na sequência de nucleotídeos do DNA','No número de células']],
  [66,'O crossing-over na meiose é responsável por:',['Aumentar o número de cromossomos','Promover a variabilidade genética','Reduzir o número de células-filhas','Impedir a recombinação gênica']],
  [67,'Vírus são parasitas intracelulares obrigatórios porque:',['Realizam fotossíntese','Possuem metabolismo próprio','Necessitam de células hospedeiras para se reproduzir','São capazes de se multiplicar no ambiente']],
  [68,'A digestão de proteínas tem início no:',['Estômago','Intestino delgado','Boca','Intestino grosso']],
  [69,'Sobre alterações demográficas contemporâneas, é correto:',['O aumento da fecundidade é a principal causa do envelhecimento','A queda da fecundidade e o aumento da expectativa de vida explicam o envelhecimento em países ricos','O crescimento da população jovem reduz demanda por serviços de saúde','Mudanças demográficas não afetam os orçamentos públicos']],
  [70,'A urbanização no Brasil se intensificou a partir de:',['1500 com a colonização portuguesa','1930 com o início da industrialização','1960 com a construção de Brasília','1990 com a globalização econômica']],
  [71,'A camada de ozônio está localizada na:',['Troposfera','Estratosfera','Mesosfera','Termosfera']],
  [72,'O clima tropical do Brasil Central caracteriza-se por:',['Chuvas bem distribuídas o ano todo e temperaturas amenas','Duas estações: verão chuvoso e inverno seco','Invernos rigorosos com geadas frequentes','Altas temperaturas e chuvas escassas o ano todo']],
  [73,'O Mercosul foi formado inicialmente por:',['Brasil, Argentina, Uruguai e Paraguai','Brasil, Argentina, Chile e Uruguai','Brasil, Colômbia, Peru e Argentina','Brasil, Venezuela, Uruguai e Paraguai']],
  [74,'A escala 1:100.000 significa que 1 cm no mapa equivale a:',['1 km no terreno','10 km no terreno','100 km no terreno','1.000 km no terreno']],
  [75,'O cerrado caracteriza-se por:',['Vegetação rasteira, árvores tortuosas e solos ácidos','Floresta densa e alta pluviosidade','Vegetação xerófita de regiões semiáridas','Presença de pinheiros e clima subtropical']],
  [76,'O IDH considera as dimensões:',['Renda, educação e saúde','PIB, inflação e taxa de juros','População, área e densidade demográfica','Exportação, importação e balança comercial']],
  [77,'A transição demográfica é a passagem de:',['Altas taxas de natalidade e mortalidade para baixas','Baixa natalidade e alta mortalidade para alta natalidade','População rural para população urbana','Economia agrícola para industrial']],
  [78,'O efeito estufa é um fenômeno natural que:',['Impede totalmente a entrada de raios solares','Mantém a temperatura terrestre adequada à vida','Apenas causa impactos negativos ao meio ambiente','É exclusivamente resultado da ação humana']],
  [79,'A Proclamação da República no Brasil ocorreu em:',['1822','1888','1889','1891']],
  [80,'O Estado Novo (1937-1945) foi marcado por:',['Ampliação dos direitos trabalhistas e fechamento do Congresso','Redemocratização e eleições diretas','Abertura econômica ao capital estrangeiro','Fim da censura e liberdade de imprensa']],
  [81,'A Guerra Fria foi caracterizada por:',['Conflitos armados diretos entre EUA e URSS','Disputa ideológica, política e tecnológica entre capitalismo e socialismo','Aliança militar entre EUA e URSS contra a China','Período de paz e cooperação global']],
  [82,'No Brasil Colonial, a economia baseava-se principalmente:',['Na indústria têxtil e siderúrgica','Na agricultura de exportação e mineração','No comércio de manufaturados com a Inglaterra','Na produção de tecnologia e inovação']],
  [83,'A Inconfidência Mineira (1789) foi um movimento que:',['Defendia a independência do Brasil e o fim da escravidão','Reivindicava redução de impostos e independência de Minas Gerais','Apoiava a Coroa Portuguesa contra invasões estrangeiras','Propunha instalar uma monarquia no Brasil']],
  [84,'A abolição da escravatura no Brasil foi concluída com a:',['Lei do Ventre Livre (1871)','Lei dos Sexagenários (1885)','Lei Áurea (1888)','Proclamação da República (1889)']],
  [85,'A OMS reconhece a dieta mediterrânea como:',['Padrão alimentar prejudicial à saúde cardiovascular','Padrão alimentar saudável que reduz riscos de doenças cardíacas','Dieta restritiva indicada apenas para perda de peso','Regime alimentar exclusivo de países asiáticos']],
  [86,'Sobre mudanças climáticas globais, é correto:',['O aquecimento global é fenômeno natural sem relação com atividades humanas','A emissão de gases de efeito estufa contribui significativamente para o aquecimento global','O protocolo de Kyoto foi rejeitado por todos os países desenvolvidos','O painel IPCC nega a existência do aquecimento global']],
  [87,'A inteligência artificial generativa tem como característica principal:',['Executar cálculos matemáticos complexos','Gerar conteúdos como textos, imagens e códigos a partir de padrões aprendidos','Substituir completamente o trabalho humano em todas as áreas','Funcionar exclusivamente com comandos de voz']],
  [88,'Sobre a matriz energética brasileira, é correto:',['O Brasil depende exclusivamente de combustíveis fósseis','A energia hidrelétrica representa parcela significativa da geração de eletricidade','A energia nuclear é a principal fonte de energia do país','A energia solar não é utilizada no Brasil']],
  [89,'Sobre os ODS da ONU, é correto:',['São metas exclusivamente ambientais sem relação com questões sociais','Englobam 17 objetivos sobre pobreza, educação, saúde, igualdade e meio ambiente','Foram propostos apenas para países em desenvolvimento','Substituíram integralmente a Declaração Universal dos Direitos Humanos']],
  [90,'Principal desafio demográfico da União Europeia:',['Crescimento acelerado da população jovem','Envelhecimento populacional e efeitos sobre previdência e saúde','Falta de políticas de imigração em todos os países-membros','Excesso de mão de obra jovem no mercado de trabalho']],
];

async function seed() {
  await ds.initialize();
  console.log('✅ Conectado!\n');

  const [{ count }] = await ds.query('SELECT COUNT(*)::int as count FROM perguntas');
  if (count > 0) {
    console.log(`⚠️  Já existem ${count} perguntas. Abortando para evitar duplicação.`);
    await ds.destroy(); return;
  }

  const ADMIN_ID = 32;
  const CURSO_ID = 1;

  const [q1] = await ds.query(
    `INSERT INTO quiz(titulo,cursoid,imagem,status,avaliativo,usuarioid) VALUES($1,$2,'',true,false,$3) RETURNING id`,
    ['Grupo 1 — Literatura, Matemática, L. Inglesa, Geografia e História', CURSO_ID, ADMIN_ID]
  );
  const [q2] = await ds.query(
    `INSERT INTO quiz(titulo,cursoid,imagem,status,avaliativo,usuarioid) VALUES($1,$2,'',true,false,$3) RETURNING id`,
    ['Grupo 2 — Biologia, Química, Física e L. Portuguesa', CURSO_ID, ADMIN_ID]
  );
  const [q3] = await ds.query(
    `INSERT INTO quiz(titulo,cursoid,imagem,status,avaliativo,usuarioid) VALUES($1,$2,'',true,false,$3) RETURNING id`,
    ['Grupo 3 — Boss Final (Todas as Matérias)', CURSO_ID, ADMIN_ID]
  );

  const QUIZ: Record<number,number> = { 1: q1.id, 2: q2.id, 3: q3.id };
  const NIVEL: Record<number,number> = { 1: 1, 2: 2, 3: 3 };
  const TEMPO: Record<number,number> = { 1: 30, 2: 25, 3: 20 };
  console.log('Quizzes criados:', QUIZ);

  let pTotal = 0, aTotal = 0, skipped = 0;

  for (const [num, conteudo, alts] of QUESTOES) {
    const catId = CAT[num];
    if (!catId) { skipped++; continue; } // questão não utilizada neste seed

    const [p] = await ds.query(
      `INSERT INTO perguntas(conteudo,perguntasnivelid,tempo,status,categoriasid,quizid)
       VALUES($1,$2,$3,true,$4,$5) RETURNING id`,
      [conteudo, NIVEL[catId], TEMPO[catId], catId, QUIZ[catId]]
    );
    pTotal++;

    for (let i = 0; i < 4; i++) {
      await ds.query(
        `INSERT INTO alternativas(perguntasid,conteudo,correta) VALUES($1,$2,$3)`,
        [p.id, alts[i], i === G[num]]
      );
      aTotal++;
    }
  }

  console.log(`\n✅ Seed concluído!`);
  console.log(`   Perguntas: ${pTotal} | Alternativas: ${aTotal}`);
  console.log(`   Cat 1 (Auditório)  quiz ${QUIZ[1]}: Q13-Q36, Q69-Q84 → L.Inglesa + Mat + Geo + Hist`);
  console.log(`   Cat 2 (Biblioteca) quiz ${QUIZ[2]}: Q1-Q12, Q37-Q68 → L.Port + Fís + Quím + Bio`);
  console.log(`   Cat 3 (Boss Final) quiz ${QUIZ[3]}: Q85-Q90 → Atualidades (todas as matérias)`);

  await ds.destroy();
}

seed().catch(e => { console.error('❌', e.message); process.exit(1); });
