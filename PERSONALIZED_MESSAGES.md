# Personalized Messages Feature

## Overview
The RSVP site now supports personalized messages for each guest. These messages will be displayed when a guest is selected from the list, before they confirm their attendance.

## Google Sheets Setup

To add personalized messages for your guests, you need to add a **"Mensagem"** column to your Google Sheets.

### Required Column
- **Column Name**: `Mensagem` (Portuguese) or `message` (English)
- **Type**: Text
- **Optional**: Yes (guests without a message will see no special message)

### Example Sheet Structure

| id | Nome              | Respondeu | Confirmado | Data       | Mensagem                                           |
|----|-------------------|-----------|------------|------------|---------------------------------------------------|
| 1  | João Silva        | FALSE     | FALSE      |            | Mal podemos esperar para celebrar com você!       |
| 2  | Maria Santos      | FALSE     | FALSE      |            | Sua presença tornará nosso dia ainda mais especial|
| 3  | Pedro Costa       | TRUE      | TRUE       | 2025-11-04 | Obrigado por fazer parte deste momento!           |
| 4  | Ana Lima          | FALSE     | FALSE      |            |                                                   |

### Message Guidelines

1. **Keep it personal**: Write messages that are specific to each guest
2. **Keep it short**: Aim for 1-2 sentences (50-100 characters)
3. **Be warm and inviting**: Use friendly, welcoming language
4. **Optional field**: Leave blank if you don't want a custom message for a guest

### Example Messages (Portuguese)

- "Estamos tão felizes que você fará parte deste dia especial!"
- "Mal podemos esperar para celebrar com você!"
- "Sua presença tornará nosso dia ainda mais especial!"
- "Obrigado por fazer parte da nossa história!"
- "Que alegria contar com você neste momento único!"
- "Sua amizade significa muito para nós!"

### Example Messages (English)

- "We can't wait to celebrate with you!"
- "Your presence will make our day extra special!"
- "So glad you'll be part of this special day!"
- "Thank you for being part of our story!"
- "We're thrilled to have you celebrate with us!"

## Technical Details

### Data Mapping
The application maps the following fields from Google Sheets:
- `Mensagem` or `message` → `guest.message`

### Display Logic
- Messages appear in an info alert box with a message icon
- Only shown when a guest is selected and before RSVP confirmation
- If no message exists, no alert is displayed
- The message is styled with proper spacing and formatting

### API Response
Your Google Sheets API should return:
```json
{
  "guests": [
    {
      "id": 1,
      "Nome": "João Silva",
      "Respondeu": false,
      "Confirmado": false,
      "Data": "",
      "Mensagem": "Mal podemos esperar para celebrar com você!"
    }
  ]
}
```

## Implementation Notes

1. The feature is fully backward compatible - existing sheets without the "Mensagem" column will continue to work
2. The message is read-only and displayed to the guest
3. No validation is performed on message content (HTML is safe - it's displayed as plain text)
4. Messages are cached with the guest data, so changes in the sheet require a page refresh
