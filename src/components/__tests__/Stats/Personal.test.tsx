import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Personal from '../../Stats/Personal';

describe('Personal', () => {
  it('renders the personal stats table', () => {
    render(<Personal />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays experience', () => {
    render(<Personal />);

    expect(screen.getByText('Years of experience')).toBeInTheDocument();
    expect(screen.getByText('3+')).toBeInTheDocument();
  });

  it('displays languages', () => {
    render(<Personal />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays current city', () => {
    render(<Personal />);

    expect(screen.getByText('Current city')).toBeInTheDocument();
    expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
  });
});
