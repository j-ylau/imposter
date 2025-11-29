'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { toast } from 'react-toastify';
import {
  CONTACT_NAME_MAX_LENGTH,
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
} from '@/lib/constants';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send message');
        setLoading(false);
        return;
      }

      toast.success('Message sent! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📬 Contact Us"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-fg mb-1">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={CONTACT_NAME_MAX_LENGTH}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fg mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            maxLength={CONTACT_EMAIL_MAX_LENGTH}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-fg mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            maxLength={CONTACT_MESSAGE_MAX_LENGTH}
            rows={5}
            required
            className="w-full p-3 rounded-lg border-2 border-border bg-bg text-fg focus:border-primary focus:outline-none resize-none"
          />
          <p className="text-xs text-fg-muted mt-1">
            {message.length}/{CONTACT_MESSAGE_MAX_LENGTH} characters
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={loading || !name || !email || !message}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="lg"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
