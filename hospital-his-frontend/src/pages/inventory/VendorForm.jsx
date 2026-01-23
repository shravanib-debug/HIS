/**
 * Vendor Form Page
 * Create and edit vendor information
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import inventoryManagerService from '../../services/inventoryManager.service';
import './VendorForm.css';

const VendorForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        vendorCode: '',
        vendorName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        panNumber: '',
        bankName: '',
        bankAccount: '',
        ifscCode: '',
        paymentTerms: '30',
        notes: '',
    });

    useEffect(() => {
        if (isEditMode) {
            fetchVendor();
        }
    }, [id]);

    const fetchVendor = async () => {
        try {
            setLoading(true);
            const response = await inventoryManagerService.getVendor(id);
            const vendor = response?.data || response;
            if (vendor) {
                setFormData({
                    vendorCode: vendor.vendorCode || '',
                    vendorName: vendor.vendorName || '',
                    contactPerson: vendor.contactPerson || '',
                    email: vendor.email || '',
                    phone: vendor.phone || '',
                    address: vendor.address || '',
                    gstNumber: vendor.gstNumber || '',
                    panNumber: vendor.panNumber || '',
                    bankName: vendor.bankDetails?.bankName || '',
                    bankAccount: vendor.bankDetails?.accountNumber || '',
                    ifscCode: vendor.bankDetails?.ifscCode || '',
                    paymentTerms: vendor.paymentTerms || '30',
                    notes: vendor.notes || '',
                });
            }
        } catch (err) {
            setError('Failed to load vendor');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.vendorCode.trim() || !formData.vendorName.trim()) {
            setError('Vendor Code and Name are required');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const dataToSend = {
                vendorCode: formData.vendorCode,
                vendorName: formData.vendorName,
                contactPerson: formData.contactPerson,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                gstNumber: formData.gstNumber,
                panNumber: formData.panNumber,
                bankDetails: {
                    bankName: formData.bankName,
                    accountNumber: formData.bankAccount,
                    ifscCode: formData.ifscCode,
                },
                paymentTerms: parseInt(formData.paymentTerms) || 30,
                notes: formData.notes,
            };

            if (isEditMode) {
                await inventoryManagerService.updateVendor(id, dataToSend);
                alert('Vendor updated successfully!');
            } else {
                await inventoryManagerService.createVendor(dataToSend);
                alert('Vendor created successfully!');
            }
            navigate('/inventory/vendors');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save vendor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="vendor-form-page">
            <header className="page-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/inventory/vendors')}>← Back</button>
                    <div>
                        <h1>{isEditMode ? 'Edit Vendor' : 'Add New Vendor'}</h1>
                        <p>{isEditMode ? 'Update vendor details' : 'Create a new vendor'}</p>
                    </div>
                </div>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="vendor-form">
                <section className="form-section">
                    <h2>Basic Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Vendor Code *</label>
                            <input name="vendorCode" value={formData.vendorCode} onChange={handleChange} required disabled={isEditMode} />
                        </div>
                        <div className="form-group">
                            <label>Vendor Name *</label>
                            <input name="vendorName" value={formData.vendorName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Tax Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>GST Number</label>
                            <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>PAN Number</label>
                            <input name="panNumber" value={formData.panNumber} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Bank Details</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input name="bankName" value={formData.bankName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Account Number</label>
                            <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>IFSC Code</label>
                            <input name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Payment Terms (Days)</label>
                            <input name="paymentTerms" type="number" value={formData.paymentTerms} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Notes</h2>
                    <div className="form-group full-width">
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Any additional notes..." />
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/inventory/vendors')}>Cancel</button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Saving...' : (isEditMode ? 'Update Vendor' : 'Create Vendor')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorForm;
