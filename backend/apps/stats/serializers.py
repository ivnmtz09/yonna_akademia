from rest_framework import serializers
from .models import XpHistory, UserStatistic, PlatformStatistic


class XpHistorySerializer(serializers.ModelSerializer):
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    quiz_title = serializers.CharField(source='related_quiz.title', read_only=True, allow_null=True)
    course_title = serializers.CharField(source='related_course.title', read_only=True, allow_null=True)
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = XpHistory
        fields = [
            "id", "xp_gained", "source", "source_display", "description",
            "related_quiz", "quiz_title", "related_course", "course_title",
            "formatted_date", "created_at"
        ]
        read_only_fields = fields

    def get_formatted_date(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")


class UserStatisticSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_level = serializers.IntegerField(source='user.level', read_only=True)
    quiz_success_rate = serializers.ReadOnlyField()
    course_completion_rate = serializers.ReadOnlyField()

    class Meta:
        model = UserStatistic
        fields = [
            "id", "user_name", "user_email", "user_level",
            "total_quizzes_attempted", "total_quizzes_passed", 
            "quiz_success_rate", "average_quiz_score",
            "total_courses_started", "total_courses_completed",
            "course_completion_rate", "total_xp_earned",
            "current_streak_days", "longest_streak_days",
            "days_active", "last_active_date", "updated_at"
        ]
        read_only_fields = fields


class PlatformStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformStatistic
        fields = [
            "id", "date", "total_users", "new_users_today", "active_users_today",
            "total_quizzes_taken", "total_xp_gained", "total_courses_started",
            "total_courses_completed", "average_session_time", "average_user_level",
            "created_at", "updated_at"
        ]
        read_only_fields = fields


class UserStatsOverviewSerializer(serializers.Serializer):
    user_level = serializers.IntegerField()
    user_xp = serializers.IntegerField()
    next_level_xp = serializers.IntegerField()
    progress_to_next_level = serializers.FloatField()
    weekly_xp_gain = serializers.IntegerField()
    monthly_xp_gain = serializers.IntegerField()
    courses_completed = serializers.IntegerField()
    quizzes_attempted = serializers.IntegerField()
    quizzes_passed = serializers.IntegerField()
    success_rate = serializers.FloatField()
    current_streak = serializers.IntegerField()
    rank = serializers.IntegerField()


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    user_name = serializers.CharField()
    user_level = serializers.IntegerField()
    user_xp = serializers.IntegerField()
    courses_completed = serializers.IntegerField()
    streak_days = serializers.IntegerField()
    is_current_user = serializers.BooleanField(default=False)


class TimeSeriesStatSerializer(serializers.Serializer):
    date = serializers.DateField()
    value = serializers.IntegerField()
    label = serializers.CharField(required=False)