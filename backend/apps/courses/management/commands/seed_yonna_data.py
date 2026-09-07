import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.conf import settings
from apps.courses.models import Course, Enrollment
from apps.quizzes.models import Quiz, Question
from apps.gamification.models import Badge, Streak, XPTransaction
from apps.vocabulary.models import VocabularyCategory, VocabularyEntry
from apps.media_content.models import MediaContent

User = get_user_model()

class Command(BaseCommand):
    help = "Llena la base de datos con contenido curricular de Wayuunaiki, quizzes, insignias, vocabulario y competidores."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🌱 Iniciando sembrado de datos de Yonna Akademia..."))

        # 1. Usuario Administrador / Docente
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            admin_user = User.objects.filter(email="admin@yonna.com").first()
        if not admin_user:
            admin_user = User.objects.create_superuser(
                email="admin@yonna.com",
                password="adminpassword123",
                first_name="Docente",
                last_name="Wayuu"
            )
            self.stdout.write(self.style.SUCCESS("✓ Superusuario 'admin@yonna.com' creado (clave: adminpassword123)"))

        # 2. Cursos Progresivos (Niveles 1 al 5) - Progresión secuencial estricta
        courses_data = [
            {
                "title": "Pünajirawaa: Saludos y Presentación",
                "description": "Aprende a presentarte, saludar según la hora del día y expresar cortesía básica en Wayuunaiki.",
                "level_required": 1,
                "difficulty": "beginner",
                "estimated_duration": 2,
            },
            {
                "title": "Apüshii: Familia y Clan Wayuu",
                "description": "Conoce los términos para tus padres, hermanos, tíos maternos y la estructura social de las castas (Eiruku).",
                "level_required": 2,
                "difficulty": "beginner",
                "estimated_duration": 3,
            },
            {
                "title": "Mma otta Wüin: Naturaleza y Geografía",
                "description": "Descubre cómo los Wayuu nombran al desierto, los cerros sagrados, la lluvia (Juyá) y el mar caribeño.",
                "level_required": 3,
                "difficulty": "intermediate",
                "estimated_duration": 4,
            },
            {
                "title": "Kattounaa: Tejidos, Colores y Mochilas",
                "description": "Adéntrate en los patrones de kanasü, los colores tradicionales y el vocabulario de las artesanas y sus mochilas susu.",
                "level_required": 4,
                "difficulty": "intermediate",
                "estimated_duration": 5,
            },
            {
                "title": "Wounmain: Sabiduría y Relatos Culturales",
                "description": "Domina expresiones avanzadas, el rol del Pütchipü'ü (palabrero) y la danza ancestral de la Yonna.",
                "level_required": 5,
                "difficulty": "advanced",
                "estimated_duration": 6,
            },
        ]

        created_courses = []
        for cdata in courses_data:
            course, created = Course.objects.update_or_create(
                title=cdata["title"],
                defaults={
                    "description": cdata["description"],
                    "level_required": cdata["level_required"],
                    "difficulty": cdata["difficulty"],
                    "estimated_duration": cdata["estimated_duration"],
                    "is_active": True,
                    "created_by": admin_user,
                }
            )
            created_courses.append(course)
            status = "creado" if created else "actualizado"
            self.stdout.write(f"  - Curso Nivel {course.level_required} ({status}): {course.title}")

        # 3. Quizzes y Preguntas Didácticas
        quizzes_info = [
            # Nivel 1 Quiz 1
            {
                "course": created_courses[0],
                "title": "Quiz 1: Saludos Matutinos y Cortesía",
                "description": "Demuestra tu dominio de las fórmulas de saludo y agradecimiento en Wayuunaiki.",
                "difficulty": "easy",
                "passing_score": 75.0,
                "xp_reward": 60,
                "questions": [
                    {
                        "text": "¿Cómo se dice '¿Cómo estás?' en Wayuunaiki?",
                        "options": ["Jamaya pia", "Anasü wattia", "Kettai", "Tachon"],
                        "correct_answer": "Jamaya pia",
                        "explanation": "'Jamaya pia' es el saludo universal para preguntar a una persona cómo está.",
                    },
                    {
                        "text": "¿Cuál es la expresión para dar los 'Buenos días' al amanecer?",
                        "options": ["Anasü wattia", "Anasü alika", "Jamaya jia", "Ainaa"],
                        "correct_answer": "Anasü wattia",
                        "explanation": "'Wattia' hace referencia a las primeras horas de la mañana, por lo que 'Anasü wattia' significa buen día.",
                    },
                    {
                        "text": "¿Qué significa la palabra 'Kettai' al terminar una conversación?",
                        "options": ["Gracias / Está bien", "Hola", "Madre", "Adelante"],
                        "correct_answer": "Gracias / Está bien",
                        "explanation": "'Kettai' o 'Anasü' se utiliza comúnmente para agradecer o indicar conformidad.",
                    },
                    {
                        "text": "Si te preguntan '¿Jamaya pia?', ¿cómo respondes afirmativamente 'Estoy bien'?",
                        "options": ["Anashii taya", "Nojotshi", "Wüin", "Tashi"],
                        "correct_answer": "Anashii taya",
                        "explanation": "'Anashii taya' expresa 'Yo estoy bien' (dicho por un hombre) o 'Anasü taya' (por una mujer).",
                    },
                ],
            },
            # Nivel 2 Quiz 1
            {
                "course": created_courses[1],
                "title": "Quiz 2: El Linaje y la Familia",
                "description": "Comprueba tu comprensión del sistema de parentesco y respeto familiar Wayuu.",
                "difficulty": "easy",
                "passing_score": 70.0,
                "xp_reward": 75,
                "questions": [
                    {
                        "text": "¿Cómo se dice 'Mi madre' con afecto en Wayuunaiki?",
                        "options": ["Tei", "Tashi", "Tawalaye", "Tachon"],
                        "correct_answer": "Tei",
                        "explanation": "'Tei' significa 'mi madre'. La madre ocupa el lugar central en la estructura matrilineal Wayuu.",
                    },
                    {
                        "text": "¿Qué familiar es el 'Tashi'?",
                        "options": ["Mi padre", "Mi abuelo", "Mi hermano", "Mi tío"],
                        "correct_answer": "Mi padre",
                        "explanation": "'Tashi' se traduce como 'mi padre'.",
                    },
                    {
                        "text": "¿Cómo se denomina al tío materno, figura de máxima autoridad en el clan?",
                        "options": ["Alaulayuu", "Pütchipü'ü", "Outshi", "Wainpirai"],
                        "correct_answer": "Alaulayuu",
                        "explanation": "El hermano de la madre (Alaulayuu) es el guía y protector legal de los sobrinos en el sistema consuetudinario Wayuu.",
                    },
                ],
            },
            # Nivel 3 Quiz 1
            {
                "course": created_courses[2],
                "title": "Quiz 3: Elementos de la Naturaleza",
                "description": "Pon a prueba tu conocimiento sobre el agua, el sol y la lluvia en la cosmovisión Wayuu.",
                "difficulty": "medium",
                "passing_score": 70.0,
                "xp_reward": 90,
                "questions": [
                    {
                        "text": "¿Qué elemento vital representa la palabra 'Wüin'?",
                        "options": ["Agua", "Fuego", "Viento", "Arena"],
                        "correct_answer": "Agua",
                        "explanation": "'Wüin' es agua, el recurso más sagrado y reverenciado en la península de La Guajira.",
                    },
                    {
                        "text": "¿Cómo se nombra a la deidad de la Lluvia y fecundador de la tierra?",
                        "options": ["Juyá", "Kaikei", "Mma", "Palaa"],
                        "correct_answer": "Juyá",
                        "explanation": "'Juyá' es el dios de la lluvia que riega a 'Mma' (la Madre Tierra).",
                    },
                    {
                        "text": "¿Qué cuerpo celeste es 'Kaikei'?",
                        "options": ["El Sol", "La Luna", "Una estrella", "El cometa"],
                        "correct_answer": "El Sol",
                        "explanation": "'Kaikei' es el Sol, que alumbra el territorio ancestral.",
                    },
                ],
            },
            # Nivel 4 Quiz 1
            {
                "course": created_courses[3],
                "title": "Quiz 4: El Arte de Tejer",
                "description": "Preguntas sobre la mochila Wayuu (susu), el diseño (kanasü) y los colores tradicionales.",
                "difficulty": "medium",
                "passing_score": 80.0,
                "xp_reward": 100,
                "questions": [
                    {
                        "text": "¿Cómo se llama la emblemática mochila tejida a mano?",
                        "options": ["Susu", "Si'ira", "Kattai", "Yonna"],
                        "correct_answer": "Susu",
                        "explanation": "La 'Susu' es la tradicional mochila Wayuu tejida con técnicas de ganchillo y telar.",
                    },
                    {
                        "text": "¿Qué término define los intrincados diseños geométricos del tejido?",
                        "options": ["Kanasü", "Jayeechi", "Kaikei", "Alaula"],
                        "correct_answer": "Kanasü",
                        "explanation": "'Kanasü' son los dibujos geométricos que representan elementos de la naturaleza y mitología.",
                    },
                ],
            },
            # Nivel 5 Quiz 1
            {
                "course": created_courses[4],
                "title": "Quiz 5: La Palabra y la Danza",
                "description": "Explora la mediación de paz del Pütchipü'ü y la danza ceremonial de la Yonna.",
                "difficulty": "hard",
                "passing_score": 80.0,
                "xp_reward": 120,
                "questions": [
                    {
                        "text": "¿Quién es el portador de la palabra encargado de resolver conflictos pacíficamente?",
                        "options": ["Pütchipü'ü", "Alaulayuu", "Outshi", "Jayeechimajachi"],
                        "correct_answer": "Pütchipü'ü",
                        "explanation": "El 'Pütchipü'ü' (Palabrero) es patrimonio inmaterial de la humanidad por su arte de mediar y conciliar.",
                    },
                    {
                        "text": "¿Qué instrumento de percusión marca el ritmo durante la danza de la Yonna?",
                        "options": ["Kasha (el tambor)", "Totoroy", "Sawawa", "Wontoloy"],
                        "correct_answer": "Kasha (el tambor)",
                        "explanation": "El 'Kasha' es el tambor sagrado de madera y cuero que guía los pasos de la mujer que persigue al varón.",
                    },
                ],
            },
        ]

        for qdata in quizzes_info:
            quiz, q_created = Quiz.objects.update_or_create(
                course=qdata["course"],
                title=qdata["title"],
                defaults={
                    "description": qdata["description"],
                    "difficulty": qdata["difficulty"],
                    "passing_score": qdata["passing_score"],
                    "xp_reward": qdata["xp_reward"],
                    "time_limit": 10,
                    "is_active": True,
                    "created_by": admin_user,
                }
            )
            quiz.questions.all().delete()
            for idx, quest in enumerate(qdata["questions"]):
                Question.objects.create(
                    quiz=quiz,
                    text=quest["text"],
                    question_type="multiple_choice",
                    options=quest["options"],
                    correct_answer=quest["correct_answer"],
                    explanation=quest["explanation"],
                    order=idx + 1
                )
            self.stdout.write(f"  ✓ Quiz configurado: {quiz.title} ({len(qdata['questions'])} preguntas)")

        # 4. Insignias del Sistema de Gamificación
        badges_data = [
            {
                "name": "Primer Paso Wayuu",
                "slug": "primer-quiz",
                "description": "Aprobaste tu primer quiz en Yonna Akademia.",
                "trigger": Badge.Trigger.QUIZZES_PERFECT,
                "threshold": 1,
                "xp_reward": 50,
            },
            {
                "name": "Fuego de la Guajira",
                "slug": "racha-3-dias",
                "description": "Mantuviste una racha de 3 días consecutivos aprendiendo.",
                "trigger": Badge.Trigger.STREAK,
                "threshold": 3,
                "xp_reward": 75,
            },
            {
                "name": "Llama Inextinguible",
                "slug": "racha-7-dias",
                "description": "Alcanzaste una racha de 7 días ininterrumpidos.",
                "trigger": Badge.Trigger.STREAK,
                "threshold": 7,
                "xp_reward": 150,
            },
            {
                "name": "Ojo de Halcón",
                "slug": "quiz-perfecto",
                "description": "Obtuviste una puntuación perfecta (100%) en una evaluación.",
                "trigger": Badge.Trigger.QUIZZES_PERFECT,
                "threshold": 1,
                "xp_reward": 100,
            },
            {
                "name": "Palabrero en Formación",
                "slug": "maestro-vocabulario",
                "description": "Dominaste 10 términos de vocabulario al Nivel 3 de Repetición Espaciada.",
                "trigger": Badge.Trigger.VOCABULARY_MASTERED,
                "threshold": 10,
                "xp_reward": 200,
            },
            {
                "name": "Guardián de la Tradición",
                "slug": "curso-completado",
                "description": "Finalizaste exitosamente un curso completo.",
                "trigger": Badge.Trigger.COURSE_COMPLETED,
                "threshold": 1,
                "xp_reward": 250,
            },
        ]

        for bdata in badges_data:
            badge, b_created = Badge.objects.update_or_create(
                slug=bdata["slug"],
                defaults={
                    "name": bdata["name"],
                    "description": bdata["description"],
                    "trigger": bdata["trigger"],
                    "threshold": bdata["threshold"],
                    "xp_reward": bdata["xp_reward"],
                    "is_active": True,
                }
            )
            self.stdout.write(f"  ✓ Insignia: {badge.name}")

        # 5. Categorías y Vocabulario Bilingüe con SRS
        categories_data = [
            {"name": "Saludos y Cortesía", "slug": "saludos", "icon": "chat_bubble", "order": 1, "description": "Fórmulas de saludo y despedida"},
            {"name": "Familia y Parentesco", "slug": "familia", "icon": "people", "order": 2, "description": "Términos del clan y relaciones"},
            {"name": "Naturaleza y Clima", "slug": "naturaleza", "icon": "eco", "order": 3, "description": "Sol, lluvia, tierra y mar"},
            {"name": "Artesanías y Objetos", "slug": "artesanias", "icon": "palette", "order": 4, "description": "Tejidos, mochilas y herramientas"},
            {"name": "Cultura y Sociedad", "slug": "cultura", "icon": "star", "order": 5, "description": "Tradición oral, música y autoridades"},
        ]

        cat_objs = {}
        for cdict in categories_data:
            cat, _ = VocabularyCategory.objects.update_or_create(
                slug=cdict["slug"],
                defaults={
                    "name": cdict["name"],
                    "icon": cdict["icon"],
                    "order": cdict["order"],
                    "description": cdict["description"],
                }
            )
            cat_objs[cdict["slug"]] = cat

        vocab_entries = [
            {
                "spanish": "¿Cómo estás?",
                "wayuu": "Jamaya pia",
                "phonetic": "Ja-ma-ya pi-a",
                "cat": "saludos",
                "type": "greeting",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Jamaya pia, tawalaye?", "spanish": "¿Cómo estás, mi hermano?"}],
            },
            {
                "spanish": "Buenos días",
                "wayuu": "Anasü wattia",
                "phonetic": "A-na-sü wat-ti-a",
                "cat": "saludos",
                "type": "greeting",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Anasü wattia süpüshua!", "spanish": "¡Buenos días a todos!"}],
            },
            {
                "spanish": "Buenas tardes",
                "wayuu": "Anasü alika",
                "phonetic": "A-na-sü a-li-ka",
                "cat": "saludos",
                "type": "greeting",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Anasü alika ma'in", "spanish": "Muy buenas tardes"}],
            },
            {
                "spanish": "Gracias",
                "wayuu": "Kettai",
                "phonetic": "Ket-ta-i",
                "cat": "saludos",
                "type": "phrase",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Kettai pümüin", "spanish": "Muchas gracias a ti"}],
            },
            {
                "spanish": "Adiós / Hasta luego",
                "wayuu": "Watta pa'a",
                "phonetic": "Wat-ta pa-a",
                "cat": "saludos",
                "type": "greeting",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Watta pa'a maalia", "spanish": "Hasta mañana temprano"}],
            },
            {
                "spanish": "Madre",
                "wayuu": "Tei",
                "phonetic": "Te-i",
                "cat": "familia",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Aisü tei tapüla", "spanish": "Amo a mi madre"}],
            },
            {
                "spanish": "Padre",
                "wayuu": "Tashi",
                "phonetic": "Ta-shi",
                "cat": "familia",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Antüshi tashi", "spanish": "Mi padre ha llegado"}],
            },
            {
                "spanish": "Tío materno / Sabio",
                "wayuu": "Alaulayuu",
                "phonetic": "A-lau-la-yu-u",
                "cat": "familia",
                "type": "noun",
                "diff": "intermediate",
                "examples": [{"wayuunaiki": "Kekiishi chi alaulayuu", "spanish": "El tío materno es muy sabio"}],
            },
            {
                "spanish": "Hijo / Hija",
                "wayuu": "Tachon",
                "phonetic": "Ta-chon",
                "cat": "familia",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Anachonyuu tachon", "spanish": "Mi hijo/a es hermoso/a"}],
            },
            {
                "spanish": "Agua",
                "wayuu": "Wüin",
                "phonetic": "Wü-in",
                "cat": "naturaleza",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Cho'ujaasü wüin", "spanish": "El agua es indispensable"}],
            },
            {
                "spanish": "Lluvia",
                "wayuu": "Juyá",
                "phonetic": "Ju-yá",
                "cat": "naturaleza",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Antüsü juyá", "spanish": "Ha venido la lluvia fértil"}],
            },
            {
                "spanish": "El Sol",
                "wayuu": "Kaikei",
                "phonetic": "Ka-i-ke-i",
                "cat": "naturaleza",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Katsüinsü kaikei", "spanish": "El sol está muy fuerte"}],
            },
            {
                "spanish": "El Mar",
                "wayuu": "Palaa",
                "phonetic": "Pa-la-a",
                "cat": "naturaleza",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Anasü tü palaaka", "spanish": "El mar es hermoso"}],
            },
            {
                "spanish": "Mochila tradicional",
                "wayuu": "Susu",
                "phonetic": "Su-su",
                "cat": "artesanias",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Kettaasü chi susu", "spanish": "La mochila está terminada"}],
            },
            {
                "spanish": "Diseño o figura geométrica",
                "wayuu": "Kanasü",
                "phonetic": "Ka-na-sü",
                "cat": "artesanias",
                "type": "noun",
                "diff": "intermediate",
                "examples": [{"wayuunaiki": "Pulashii kanasüka", "spanish": "El diseño encierra poder sagrado"}],
            },
            {
                "spanish": "Palabrero / Mediador",
                "wayuu": "Pütchipü'ü",
                "phonetic": "Püt-chi-pü-ü",
                "cat": "cultura",
                "type": "noun",
                "diff": "intermediate",
                "examples": [{"wayuunaiki": "Aküjüshi pütchi chi pütchipü'ü", "spanish": "El palabrero transmite el mensaje de paz"}],
            },
            {
                "spanish": "Danza ceremonial",
                "wayuu": "Yonna",
                "phonetic": "Yon-na",
                "cat": "cultura",
                "type": "noun",
                "diff": "beginner",
                "examples": [{"wayuunaiki": "Ayonnajüshii na majayünnüükana", "spanish": "Las jóvenes bailan la Yonna"}],
            },
            {
                "spanish": "Canto poético tradicional",
                "wayuu": "Jayeechi",
                "phonetic": "Ja-ye-e-chi",
                "cat": "cultura",
                "type": "noun",
                "diff": "intermediate",
                "examples": [{"wayuunaiki": "Jayeechimajachi nia", "spanish": "Él es un gran cantor tradicional"}],
            },
        ]

        for ventry in vocab_entries:
            VocabularyEntry.objects.update_or_create(
                spanish_term=ventry["spanish"],
                defaults={
                    "wayuunaiki_translation": ventry["wayuu"],
                    "phonetic_transcription": ventry["phonetic"],
                    "category": cat_objs[ventry["cat"]],
                    "word_type": ventry["type"],
                    "difficulty": ventry["diff"],
                    "usage_examples": ventry["examples"],
                }
            )
        self.stdout.write(f"  ✓ Vocabulario sembrado: {len(vocab_entries)} términos bilingües.")

        # 6. Contenido Multimedia Cultural (Audios y Relatos)
        media_items_data = [
            {
                "title": "Leyenda de Wale'kerü (La Araña Tejedora)",
                "description": "El mítico relato de cómo Wale'kerü enseñó a tejer los primeros kanasü a la doncella Wayuu.",
                "media_type": "audio",
                "category": "stories",
                "duration": 185,
                "attribution": "Tradición Oral de la Alta Guajira",
            },
            {
                "title": "Jayeechi de Bienvenida a la Lluvia",
                "description": "Canto poético entonado para agradecer el retorno del agua y la fertilidad de la tierra.",
                "media_type": "audio",
                "category": "music",
                "duration": 210,
                "attribution": "Sabedores de Uribia",
            },
            {
                "title": "El Toque Sagrado del Kasha",
                "description": "Grabación de los ritmos tradicionales del tambor en la fiesta de la Yonna.",
                "media_type": "audio",
                "category": "cultural",
                "duration": 140,
                "attribution": "Músicos Tradicionales Wayuu",
            },
        ]

        for mdata in media_items_data:
            dummy_content = ContentFile(b"ID3\x03\x00\x00\x00\x00\x00#TSSE\x00\x00\x00\x0f\x00\x00\x03Audio Wayuu Demo")
            media_obj, m_created = MediaContent.objects.update_or_create(
                title=mdata["title"],
                defaults={
                    "description": mdata["description"],
                    "media_type": mdata["media_type"],
                    "category": mdata["category"],
                    "duration": mdata["duration"],
                    "attribution": mdata["attribution"],
                    "license": "educational",
                    "uploaded_by": admin_user,
                }
            )
            if not media_obj.file:
                media_obj.file.save(f"audio_{media_obj.id}.mp3", dummy_content, save=True)
            self.stdout.write(f"  ✓ Contenido Cultural: {media_obj.title}")

        # 7. Usuarios Competidores para el Leaderboard
        competitors = [
            {"email": "valeria.mendoza@yonna.com", "first_name": "Valeria", "last_name": "Mendoza", "xp": 1420, "level": 4, "streak": 14},
            {"email": "saray.epieyu@yonna.com", "first_name": "Saray", "last_name": "Epieyu", "xp": 1180, "level": 3, "streak": 11},
            {"email": "david.uriana@yonna.com", "first_name": "David", "last_name": "Uriana", "xp": 950, "level": 3, "streak": 8},
            {"email": "mateo.pushaina@yonna.com", "first_name": "Mateo", "last_name": "Pushaina", "xp": 720, "level": 2, "streak": 6},
            {"email": "camila.ipuana@yonna.com", "first_name": "Camila", "last_name": "Ipuana", "xp": 510, "level": 2, "streak": 4},
            {"email": "samuel.jusayuu@yonna.com", "first_name": "Samuel", "last_name": "Jusayuu", "xp": 340, "level": 1, "streak": 2},
        ]

        for comp in competitors:
            cuser, c_created = User.objects.get_or_create(
                email=comp["email"],
                defaults={
                    "first_name": comp["first_name"],
                    "last_name": comp["last_name"],
                    "role": "user",
                    "xp": comp["xp"],
                    "level": comp["level"],
                }
            )
            cuser.xp = comp["xp"]
            cuser.level = comp["level"]
            cuser.save()
            Streak.objects.update_or_create(
                user=cuser,
                defaults={
                    "current_streak": comp["streak"],
                    "longest_streak": comp["streak"] + 2,
                    "freeze_tokens": 1,
                }
            )
            # Registrar transacción de XP para que aparezca en el Leaderboard
            XPTransaction.objects.get_or_create(
                user=cuser,
                reason=XPTransaction.Reason.LESSON_COMPLETE,
                defaults={"amount": comp["xp"]}
            )

        # 8. Inscribir usuarios normales al Curso Nivel 1 (Secuencial)
        all_regular_users = User.objects.filter(is_superuser=False)
        course_1 = created_courses[0]
        for reg_u in all_regular_users:
            Enrollment.objects.get_or_create(
                user=reg_u,
                course=course_1,
                defaults={"progress": 0.0, "course_completed": False}
            )

        self.stdout.write(self.style.SUCCESS("🎉 ¡Sembrado de datos completado exitosamente!"))
