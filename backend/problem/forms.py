from django import forms
from problem.models import Solution

LANGUAGE_CHOICES = [
    ("py", "Python"),
    ("c", "C"),
    ("cpp", "C++"),
    ("java", "Java"),
]


class SubmitCodeForm(forms.ModelForm):
    language = forms.ChoiceField(choices=LANGUAGE_CHOICES)
    class Meta:
        model = Solution
        fields = ["language", "code", "problem"]


