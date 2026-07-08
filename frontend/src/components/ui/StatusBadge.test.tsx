import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge, statusTone } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders translated enum-like labels with the expected visual tone', () => {
    render(<StatusBadge status="EM_ANALISE" />);

    expect(screen.getByText('Em análise')).toBeInTheDocument();
    expect(statusTone('PAGO')).toBe('success');
    expect(statusTone('ATRASADO')).toBe('danger');
  });
});
