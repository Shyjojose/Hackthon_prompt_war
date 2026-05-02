import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IncidentForm } from './IncidentForm';

describe('IncidentForm Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render incident form with title and booth name', () => {
    const { container } = render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText(/Report an Issue/)).toBeInTheDocument();
    // Check that booth name appears somewhere in the DOM
    expect(container.textContent).toContain('Test Booth');
  });

  it('should enforce 500 character limit', () => {
    const { container } = render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('maxLength', '500');
  });

  it('should display character counter', () => {
    const { container } = render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    const counter = container.querySelector('#desc-counter');
    expect(counter).toBeInTheDocument();
    expect(counter?.textContent).toContain('/500');
  });

  it('should have issue type select dropdown', () => {
    const { container } = render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    const select = container.querySelector('select');
    expect(select).toBeInTheDocument();
    const options = container.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should focus on description input when modal opens', () => {
    const { container } = render(
      <IncidentForm 
        boothId="test-123" 
        boothName="Test Booth" 
        onClose={mockOnClose}
      />
    );
    
    const textarea = container.querySelector('textarea');
    expect(document.activeElement).toBe(textarea);
  });
});
