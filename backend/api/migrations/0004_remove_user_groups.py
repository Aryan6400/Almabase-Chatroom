# Generated by Django 5.0.4 on 2024-04-25 08:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_chat_lastmessage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
    ]
