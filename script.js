import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/*
  Замените значения на данные вашего проекта Supabase.
  Project URL и anon key: Supabase → Project Settings → API.
  Никогда не используйте здесь service_role key.
*/
const SUPABASE_URL = "ВСТАВЬТЕ_PROJECT_URL";
const SUPABASE_ANON_KEY = "ВСТАВЬТЕ_ANON_KEY";

/*
  Укажите email вашего аккаунта Supabase Auth.
  Это управляет отображением кнопок в интерфейсе.
  Настоящая защита редактирования дополнительно задаётся RLS в Supabase.
*/
const EDITOR_EMAIL = "ВАШ_EMAIL";

const CATEGORY_NAMES = [
  "Цифровая схемотехника",
  "Электротехника и электроника"
];

const STARTER_ANSWERS = [
  {
    category: "Цифровая схемотехника",
    question: "Двоичная система счисления",
    answer: "В двоичной системе используются цифры 0 и 1. Разряд имеет вес 2ⁿ. Например, 1011₂ = 1·8 + 0·4 + 1·2 + 1·1 = 11₁₀. Для перевода целого числа из десятичной системы последовательно делят его на 2 и записывают остатки в обратном порядке."
  },
  {
    category: "Цифровая схемотехника",
    question: "Основные логические операции и таблицы истинности",
    answer: "НЕ (¬A) инвертирует значение. И (A∧B) равно 1, только если оба входа равны 1. ИЛИ (A∨B) равно 1, если хотя бы один вход равен 1.\n\nA B | ¬A | A∧B | A∨B\n0 0 |  1 |   0 |   0\n0 1 |  1 |   0 |   1\n1 0 |  0 |   0 |   1\n1 1 |  0 |   1 |   1"
  },
  {
    category: "Цифровая схемотехника",
    question: "Булевы функции и алгебра логики",
    answer: "Булева функция принимает двоичные значения и задаётся таблицей истинности, формулой или логической схемой. Основные тождества: A∧1=A; A∨0=A; A∧0=0; A∨1=1; A∧A=A; A∨A=A; ¬¬A=A. Законы де Моргана: ¬(A∧B)=¬A∨¬B; ¬(A∨B)=¬A∧¬B."
  },
  {
    category: "Цифровая схемотехника",
    question: "Минимизация булевых функций",
    answer: "Минимизация уменьшает число переменных или логических элементов при сохранении функции. Применяют преобразования по законам алгебры логики, карты Карно и метод Квайна—Мак-Класки. На карте Карно объединяют соседние единицы группами по 1, 2, 4, 8 и т. д.; каждая группа даёт импликанту."
  },
  {
    category: "Цифровая схемотехника",
    question: "RS-, D-, T- и JK-триггеры",
    answer: "RS хранит бит: S=1 устанавливает Q=1, R=1 сбрасывает Q=0; запрещённая комбинация зависит от реализации. Синхронный RS реагирует на входы при активном тактовом сигнале. D-триггер при такте записывает D в Q. T-триггер при T=1 меняет состояние, при T=0 сохраняет. JK: J=K=1 переключает состояние, J=1 устанавливает, K=1 сбрасывает."
  },
  {
    category: "Цифровая схемотехника",
    question: "Дешифратор и шифратор",
    answer: "Дешифратор преобразует двоичный код из n входов в один активный выход из 2ⁿ. Шифратор выполняет обратную функцию: по активному входу формирует его двоичный номер. При нескольких одновременных входах применяют приоритетный шифратор."
  },
  {
    category: "Цифровая схемотехника",
    question: "Мультиплексор и демультиплексор",
    answer: "Мультиплексор выбирает один из информационных входов и передаёт его на выход согласно адресным линиям. Демультиплексор направляет один входной сигнал на один из нескольких выходов. Для 2ⁿ каналов требуется n адресных разрядов."
  },
  {
    category: "Цифровая схемотехника",
    question: "Сумматоры и арифметико-логические устройства",
    answer: "Полусумматор складывает два бита: сумма S=A⊕B, перенос C=A∧B. Полный сумматор учитывает входной перенос: S=A⊕B⊕Cᵢₙ. АЛУ выполняет арифметические и логические операции над словами по управляющему коду; результат и флаги сохраняются в регистрах."
  },
  {
    category: "Цифровая схемотехника",
    question: "Счётчики: суммирующий, вычитающий, реверсивный и двоично-десятичный",
    answer: "Счётчик — последовательностное устройство, меняющее состояние по импульсам. Суммирующий увеличивает код, вычитающий уменьшает, реверсивный умеет оба направления. Двоичный n-разрядный счётчик имеет до 2ⁿ состояний. Двоично-десятичный считает 0…9 и затем возвращается к 0."
  },
  {
    category: "Цифровая схемотехника",
    question: "Регистры",
    answer: "Параллельный регистр одновременно загружает все разряды. Последовательный принимает или выдаёт биты по одному. Параллельно-последовательный сочетает режимы. Универсальный регистр обычно поддерживает параллельную загрузку, сдвиг влево и вправо, хранение и последовательный ввод/вывод."
  },
  {
    category: "Цифровая схемотехника",
    question: "Запоминающие устройства: параметры, классификация и структура",
    answer: "Основные параметры: ёмкость, время доступа, быстродействие, энергопотребление, надёжность и срок хранения. Память бывает энергозависимой (например, SRAM, DRAM) и энергонезависимой (ROM, Flash). Адресная память включает массив ячеек, адресные входы, дешифратор, цепи чтения/записи и ввод-вывод данных."
  },
  {
    category: "Цифровая схемотехника",
    question: "Микропроцессор и микроконтроллер",
    answer: "Микропроцессор обычно содержит вычислительное ядро и использует внешние память и периферию. Микроконтроллер объединяет на одном кристалле процессор, память программ и данных, порты ввода-вывода, таймеры и интерфейсы. Характеристики МК: разрядность, частота, объём памяти, набор периферии, напряжение и энергопотребление."
  },
  {
    category: "Цифровая схемотехника",
    question: "Представление информации в цифровой вычислительной технике",
    answer: "Информация кодируется битами. Беззнаковые числа представляют двоичным кодом; знаковые часто используют дополнительный код. Дробные числа кодируют фиксированной или плавающей точкой. Текст кодируют таблицами символов, например Unicode; изображения и звук — дискретными цифровыми отсчётами."
  },
  {
    category: "Электротехника и электроника",
    question: "Электрическая цепь. Ток, напряжение, ЭДС и мощность",
    answer: "Электрическая цепь — совокупность источников, потребителей и соединений для протекания тока. Ток I — заряд за время: I=Δq/Δt, ампер. Напряжение U — работа на единицу заряда, вольт. ЭДС характеризует работу сторонних сил источника. Мощность P=UI; для резистора также P=I²R=U²/R."
  },
  {
    category: "Электротехника и электроника",
    question: "Резисторы: последовательное и параллельное соединение",
    answer: "При последовательном соединении ток одинаков, а Rэкв=R₁+R₂+…; напряжение делится. При параллельном напряжение одинаково, а 1/Rэкв=Σ(1/Rᵢ); ток делится. Смешанную цепь упрощают поэтапно, заменяя группы эквивалентным сопротивлением."
  },
  {
    category: "Электротехника и электроника",
    question: "Закон Ома и законы Кирхгофа",
    answer: "Для участка цепи U=IR. Для полной цепи с ЭДС E и внутренним сопротивлением r: I=E/(R+r). Первый закон Кирхгофа: алгебраическая сумма токов в узле равна нулю. Второй закон: сумма падений напряжений в замкнутом контуре равна сумме ЭДС."
  },
  {
    category: "Электротехника и электроника",
    question: "Метод преобразования и потеря напряжения в проводах",
    answer: "Метод преобразования упрощает цепь заменой последовательных и параллельных участков эквивалентными сопротивлениями. Потеря напряжения на проводе ΔU=IRпровода; для двухпроводной линии учитывают сопротивление обоих проводов. Мощность потерь Pпот=I²R."
  },
  {
    category: "Электротехника и электроника",
    question: "Измерение тока, напряжения и сопротивления. Баланс мощностей",
    answer: "Амперметр включают последовательно и выбирают малое внутреннее сопротивление. Вольтметр подключают параллельно и выбирают большое входное сопротивление. Сопротивление измеряют омметром на обесточенной цепи. Баланс мощностей: мощность источников равна сумме потребляемых мощностей и потерь."
  },
  {
    category: "Электротехника и электроника",
    question: "Погрешности и средства измерений",
    answer: "Погрешность — отклонение результата измерения от истинного значения. Абсолютная погрешность Δx=xизм−xист; относительная δ=|Δx|/|xист|·100%. Различают систематические, случайные и грубые погрешности. Средства измерений характеризуются диапазоном, точностью, чувствительностью, разрешением и входным воздействием."
  },
  {
    category: "Электротехника и электроника",
    question: "Аналоговые и цифровые измерительные приборы",
    answer: "Аналоговые приборы преобразуют измеряемую величину в отклонение стрелки; принцип действия зависит от измерительной системы: магнитоэлектрической, электромагнитной, электродинамической и др. Цифровые приборы преобразуют сигнал в цифровой код с помощью АЦП и показывают результат на индикаторе; точность зависит от АЦП, опорного источника и входной схемы."
  },
  {
    category: "Электротехника и электроника",
    question: "Методы измерения параметров цепей",
    answer: "Прямой метод использует показание прибора непосредственно. Косвенный метод вычисляет параметр по измеренным величинам, например R=U/I. Сравнительные методы сопоставляют неизвестную величину с известной. Для уменьшения влияния прибора и помех выбирают подходящий диапазон, схему подключения и повторяют измерения."
  },
  {
    category: "Электротехника и электроника",
    question: "Переменный ток, фаза и действующее значение",
    answer: "Синусоидальная величина x(t)=Xₘsin(ωt+φ), где Xₘ — амплитуда, ω=2πf — угловая частота, φ — начальная фаза. Действующее значение синусоиды X=Xₘ/√2. Фаза показывает положение колебания во времени; разность фаз характеризует сдвиг между величинами."
  },
  {
    category: "Электротехника и электроника",
    question: "Измерение переменных токов и напряжений",
    answer: "Переменные величины измеряют приборами, рассчитанными на соответствующий диапазон частот и форму сигнала. Большинство мультиметров показывает действующее значение синусоиды; True RMS приборы корректнее измеряют несинусоидальные сигналы в пределах своего частотного диапазона. Ток измеряют последовательно или клещами."
  },
  {
    category: "Электротехника и электроника",
    question: "Цепи с резистором, индуктивностью и ёмкостью",
    answer: "В резисторе U и I совпадают по фазе; R не зависит от частоты в идеальной модели. В катушке U опережает I на 90°, Xₗ=ωL. В конденсаторе I опережает U на 90°, Xс=1/(ωC). Для синусоидальной цепи применяют комплексные сопротивления и закон Ома для действующих значений."
  },
  {
    category: "Электротехника и электроника",
    question: "Диэлектрики и полупроводники n-типа и p-типа",
    answer: "Диэлектрик имеет малую концентрацию свободных носителей; во внешнем поле происходит поляризация. В собственном полупроводнике тепловая генерация создаёт электронно-дырочные пары, поэтому концентрация носителей растёт с температурой. Донорная примесь создаёт n-тип с основными электронами; акцепторная — p-тип с основными дырками. При нагреве растёт концентрация носителей и меняются проводимость и параметры переходов."
  },
  {
    category: "Электротехника и электроника",
    question: "Полупроводниковые диоды и их виды",
    answer: "Диод — двухэлектродный прибор на p-n-переходе, проводящий ток преимущественно в прямом направлении. Выпрямительный диод преобразует переменный ток в пульсирующий однонаправленный. Стабилитрон работает в обратном пробое для стабилизации напряжения. Импульсные диоды рассчитаны на быстрое переключение. Фотодиод реагирует на свет, светодиод излучает свет, оптрон передаёт сигнал светом между электрически изолированными цепями."
  },
  {
    category: "Электротехника и электроника",
    question: "Биполярные транзисторы и схемы включения",
    answer: "Биполярный транзистор имеет слои npn или pnp и выводы эмиттер, база, коллектор. Небольшой ток базы управляет большим током коллектора. Общая база: низкое входное, высокое выходное сопротивление, усиление тока около единицы. Общий эмиттер: значительное усиление тока и напряжения, инверсия фазы. Общий коллектор: усиление по напряжению около единицы, высокое входное и низкое выходное сопротивление."
  },
  {
    category: "Электротехника и электроника",
    question: "Полевые транзисторы с p-n-переходом",
    answer: "JFET управляется напряжением затвора, изменяющим ширину канала и его проводимость; током затвора в нормальном режиме пренебрегают. Основные выводы — затвор, исток и сток. Характеристики: выходная I_D=f(U_DS) при разных U_GS и передаточная I_D=f(U_GS). Схемы включения: общий исток, общий затвор, общий сток."
  },
  {
    category: "Электротехника и электроника",
    question: "МОП-транзисторы с изолированным затвором",
    answer: "В MOSFET затвор отделён от полупроводника тонким диэлектриком, поэтому входное сопротивление очень велико. Напряжение затвора создаёт или изменяет проводящий канал. Бывают n- и p-канальные приборы, обогащённого и встроенного типов. Выводы: затвор, исток, сток и часто подложка; распространённая схема усилителя — с общим истоком."
  },
  {
    category: "Электротехника и электроника",
    question: "Усилительные устройства и каскады",
    answer: "Усилитель увеличивает напряжение, ток или мощность сигнала за счёт энергии источника питания. Классифицируется по усиливаемой величине, частоте и режиму работы. Каскад с общим эмиттером обычно содержит транзистор, смещение базы, коллекторную нагрузку и разделительные/байпасные конденсаторы. Полевой каскад строится аналогично, но управляется напряжением затвора."
  },
  {
    category: "Электротехника и электроника",
    question: "Операционный усилитель: обозначение и параметры",
    answer: "ОУ — усилитель с дифференциальным входом, инвертирующим (−) и неинвертирующим (+), и большим коэффициентом усиления. Идеальная модель имеет бесконечное усиление и входное сопротивление, нулевое выходное сопротивление. Практические параметры: напряжение смещения, входные токи, полоса и скорость нарастания, шум, CMRR, PSRR, выходной диапазон и напряжение питания."
  },
  {
    category: "Электротехника и электроника",
    question: "Стабилизаторы и компенсационные стабилизаторы",
    answer: "Стабилизатор поддерживает выходное напряжение или ток при изменении входа и нагрузки. Бывает параметрический, компенсационный линейный и импульсный. Основные характеристики: точность стабилизации, коэффициент стабилизации, выходное сопротивление, диапазон входа, КПД, пульсации, температурный режим и надёжность. В компенсационном стабилизаторе выход сравнивают с опорным источником и регулируют проходной элемент по сигналу ошибки; в непрерывном варианте регулирование происходит плавно."
  }
];

const $ = (id) => document.getElementById(id);
const safeConfig = SUPABASE_URL.startsWith("https://")
  && SUPABASE_ANON_KEY.length > 20
  && !SUPABASE_URL.includes("ВСТАВЬТЕ");

let supabase = null;
let answers = [];
let currentUser = null;
let editingId = null;

const topicsEl = $("topics");
const searchEl = $("search");
const statusEl = $("statusMessage");

function setStatus(message) {
  statusEl.textContent = message;
}

function isEditor() {
  return Boolean(
    currentUser &&
    EDITOR_EMAIL !== "ВАШ_EMAIL" &&
    currentUser.email?.toLowerCase() === EDITOR_EMAIL.toLowerCase()
  );
}

function updateEditorUI() {
  $("loginButton").classList.toggle("hidden", isEditor());
  $("logoutButton").classList.toggle("hidden", !isEditor());
  $("addButton").classList.toggle("hidden", !isEditor());
  $("editorNotice").classList.toggle("hidden", !isEditor());
  render();
}

function renderNavigation() {
  $("navigation").replaceChildren();
  CATEGORY_NAMES.forEach((category, index) => {
    const link = document.createElement("a");
    link.href = `#section-${index}`;
    link.textContent = category;
    $("navigation").append(link);
  });
}

function render() {
  const query = searchEl.value.trim().toLocaleLowerCase("ru");
  topicsEl.replaceChildren();

  CATEGORY_NAMES.forEach((category, index) => {
    const section = document.createElement("section");
    section.className = "topic-section";
    section.id = `section-${index}`;

    const heading = document.createElement("h2");
    heading.textContent = category;
    section.append(heading);

    const filtered = answers.filter(item =>
      item.category === category &&
      `${item.question} ${item.answer}`.toLocaleLowerCase("ru").includes(query)
    );

    filtered.forEach(item => section.append(makeCard(item)));
    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "status-message";
      empty.textContent = query ? "Совпадений не найдено." : "Пока нет ответов в этом разделе.";
      section.append(empty);
    }
    topicsEl.append(section);
  });
}

function makeCard(item) {
  const card = document.createElement("article");
  card.className = "answer-card";

  const title = document.createElement("h3");
  title.textContent = item.question;

  const text = document.createElement("div");
  text.className = "answer-text";
  text.textContent = item.answer;

  card.append(title, text);

  if (item.image_url) {
    const image = document.createElement("img");
    image.className = "answer-image";
    image.src = item.image_url;
    image.alt = `Иллюстрация: ${item.question}`;
    image.loading = "lazy";
    image.onerror = () => image.remove();
    card.append(image);
  }

  if (isEditor()) {
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const edit = document.createElement("button");
    edit.className = "button button-outline";
    edit.textContent = "Изменить";
    edit.addEventListener("click", () => openEditor(item));

    const remove = document.createElement("button");
    remove.className = "button button-outline";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => deleteAnswer(item.id));

    actions.append(edit, remove);
    card.append(actions);
  }

  return card;
}

function useStarterAnswers() {
  answers = STARTER_ANSWERS.map((item, index) => ({
    ...item,
    id: `starter-${index}`,
    image_url: null
  }));
  render();
}

async function loadAnswers() {
  if (!supabase) {
    useStarterAnswers();
    $("connection").textContent = "Демо-режим";
    setStatus("Заполните настройки Supabase в app.js, чтобы включить общую базу и обновления.");
    return;
  }

  const { data, error } = await supabase
    .from("exam_answers")
    .select("id, category, question, answer, image_url")
    .order("category")
    .order("question");

  if (error) {
    useStarterAnswers();
    setStatus(`Не удалось загрузить базу: ${error.message}`);
    return;
  }

  answers = data ?? [];
  render();
  setStatus(answers.length ? "" : "База пока пуста. Войдите и добавьте ответы.");
}

function openEditor(item = null) {
  if (!isEditor()) return;
  editingId = item?.id ?? null;
  $("dialogTitle").textContent = editingId ? "Изменить ответ" : "Добавить ответ";
  $("categoryInput").value = item?.category ?? CATEGORY_NAMES[0];
  $("questionInput").value = item?.question ?? "";
  $("answerInput").value = item?.answer ?? "";
  $("imageInput").value = item?.image_url ?? "";
  $("answerDialog").showModal();
}

async function saveAnswer(event) {
  event.preventDefault();
  if (!isEditor() || !supabase) return;

  const record = {
    category: $("categoryInput").value,
    question: $("questionInput").value.trim(),
    answer: $("answerInput").value.trim(),
    image_url: $("imageInput").value.trim() || null
  };

  const result = editingId
    ? await supabase.from("exam_answers").update(record).eq("id", editingId)
    : await supabase.from("exam_answers").insert(record);

  if (result.error) {
    setStatus(`Не удалось сохранить: ${result.error.message}`);
    return;
  }

  $("answerDialog").close();
  $("answerForm").reset();
  setStatus("Сохранено.");
  await loadAnswers();
}

async function deleteAnswer(id) {
  if (!isEditor() || !supabase) return;
  if (!confirm("Удалить этот ответ?")) return;

  const { error } = await supabase.from("exam_answers").delete().eq("id", id);
  if (error) {
    setStatus(`Не удалось удалить: ${error.message}`);
    return;
  }

  setStatus("Ответ удалён.");
  await loadAnswers();
}

async function signIn(event) {
  event.preventDefault();
  $("loginError").textContent = "";

  const { data, error } = await supabase.auth.signInWithPassword({
    email: $("emailInput").value.trim(),
    password: $("passwordInput").value
  });

  if (error) {
    $("loginError").textContent = error.message;
    return;
  }

  if (data.user?.email?.toLowerCase() !== EDITOR_EMAIL.toLowerCase()) {
    await supabase.auth.signOut();
    $("loginError").textContent = "Этот аккаунт не имеет прав редактора.";
    return;
  }

  currentUser = data.user;
  $("loginDialog").close();
  updateEditorUI();
}

async function init() {
  renderNavigation();

  if (!safeConfig) {
    useStarterAnswers();
    $("connection").textContent = "Демо-режим";
    setStatus("Сайт показывает готовые ответы. Настройте Supabase, чтобы включить вход, сохранение и realtime.");
  } else {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data } = await supabase.auth.getSession();
    currentUser = data.session?.user ?? null;
    updateEditorUI();
    await loadAnswers();

    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ?? null;
      updateEditorUI();
    });

    supabase.channel("exam-answers-live")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "exam_answers"
      }, loadAnswers)
      .subscribe((state) => {
        $("connection").textContent =
          state === "SUBSCRIBED" ? "● Онлайн" : "Ожидание подключения…";
      });
  }
}

$("search").addEventListener("input", render);
$("addButton").addEventListener("click", () => openEditor());
$("answerForm").addEventListener("submit", saveAnswer);
$("cancelButton").addEventListener("click", () => $("answerDialog").close());
$("loginButton").addEventListener("click", () => {
  if (!supabase) {
    setStatus("Сначала настройте Supabase в app.js.");
    return;
  }
  $("loginDialog").showModal();
});
$("cancelLoginButton").addEventListener("click", () => $("loginDialog").close());
$("loginForm").addEventListener("submit", signIn);
$("logoutButton").addEventListener("click", async () => {
  await supabase?.auth.signOut();
  currentUser = null;
  updateEditorUI();
});
$("addButton").addEventListener("click", () => openEditor());

init();
