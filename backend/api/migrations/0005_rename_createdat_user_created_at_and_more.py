# Generated by Django 5.0.4 on 2024-04-26 21:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_user_groups'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='createdAt',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='updatedAt',
            new_name='edited_at',
        ),
    ]
